'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { PortfolioAsset, Transaction, CryptoAsset } from '@/types/crypto';

export const usePortfolio = (userId: string | undefined) => {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Subscribe to portfolio changes
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const portfolioRef = collection(db, 'users', userId, 'portfolio');
    const transactionsRef = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribePortfolio = onSnapshot(portfolioRef, (snapshot) => {
      const portfolioData: PortfolioAsset[] = [];
      snapshot.forEach((doc) => {
        portfolioData.push({ id: doc.id, ...doc.data() } as PortfolioAsset);
      });
      setPortfolio(portfolioData);
      setLoading(false);
    });

    const unsubscribeTransactions = onSnapshot(transactionsRef, (snapshot) => {
      const transactionData: Transaction[] = [];
      snapshot.forEach((doc) => {
        transactionData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transactionData);
    });

    return () => {
      unsubscribePortfolio();
      unsubscribeTransactions();
    };
  }, [userId]);

  // Calculate total portfolio value
  const calculateTotalValue = useCallback((portfolioData: PortfolioAsset[], cryptoData: CryptoAsset[]) => {
    let total = 0;
    portfolioData.forEach(asset => {
      const cryptoAsset = cryptoData.find(c => c.id === asset.id);
      if (cryptoAsset) {
        total += asset.amount * cryptoAsset.current_price;
      }
    });
    setTotalValue(total);
  }, []);

  // Add asset to portfolio
  const addToPortfolio = useCallback(async (asset: CryptoAsset, amount: number) => {
    if (!userId) return;

    try {
      const portfolioRef = doc(db, 'users', userId, 'portfolio', asset.id);
      
      // Check if asset already exists
      const existingAsset = portfolio.find(p => p.id === asset.id);
      const newAmount = existingAsset ? existingAsset.amount + amount : amount;

      await setDoc(portfolioRef, {
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        amount: newAmount,
        addedAt: new Date().toISOString()
      });

      // Add transaction
      await addTransaction({
        type: 'buy',
        assetId: asset.id,
        symbol: asset.symbol,
        amount,
        price: asset.current_price,
        total: amount * asset.current_price,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error adding to portfolio:', error);
    }
  }, [userId, portfolio]);

  // Remove asset from portfolio
  const removeFromPortfolio = useCallback(async (assetId: string) => {
    if (!userId) return;

    try {
      const portfolioRef = doc(db, 'users', userId, 'portfolio', assetId);
      await deleteDoc(portfolioRef);
    } catch (error) {
      console.error('Error removing from portfolio:', error);
    }
  }, [userId]);

  // Add transaction
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!userId) return;

    try {
      const transactionsRef = collection(db, 'users', userId, 'transactions');
      await addDoc(transactionsRef, transaction);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }, [userId]);

  return {
    portfolio,
    transactions,
    totalValue,
    loading,
    addToPortfolio,
    removeFromPortfolio,
    addTransaction,
    calculateTotalValue
  };
};