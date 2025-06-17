'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { PriceAlert, CryptoAsset } from '@/types/crypto';
import { formatCurrency } from '@/utils/formatters';

interface PriceAlertsProps {
  userId: string | undefined;
  cryptoData: CryptoAsset[];
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({
  userId,
  cryptoData
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    assetId: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below'
  });

  // Subscribe to alerts
  useEffect(() => {
    if (!userId) return;

    const alertsRef = collection(db, 'users', userId, 'alerts');
    const unsubscribe = onSnapshot(alertsRef, (snapshot) => {
      const alertsData: PriceAlert[] = [];
      snapshot.forEach((doc) => {
        alertsData.push({ id: doc.id, ...doc.data() } as PriceAlert);
      });
      setAlerts(alertsData);
    });

    return () => unsubscribe();
  }, [userId]);

  // Check for triggered alerts
  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const asset = cryptoData.find(c => c.id === alert.assetId);
      if (!asset) return;

      const shouldTrigger = 
        (alert.condition === 'above' && asset.current_price >= alert.targetPrice) ||
        (alert.condition === 'below' && asset.current_price <= alert.targetPrice);

      if (shouldTrigger) {
        triggerAlert(alert, asset);
      }
    });
  }, [cryptoData, alerts]);

  const triggerAlert = async (alert: PriceAlert, asset: CryptoAsset) => {
    if (!userId) return;

    try {
      // Update alert as triggered
      const alertRef = doc(db, 'users', userId, 'alerts', alert.id);
      await setDoc(alertRef, {
        ...alert,
        isActive: false,
        triggeredAt: new Date().toISOString()
      });

      // Show notification (you can implement a toast notification here)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Price Alert: ${asset.symbol.toUpperCase()}`, {
          body: `${asset.name} has reached ${formatCurrency(asset.current_price)}`,
          icon: asset.image
        });
      }
    } catch (error) {
      console.error('Error triggering alert:', error);
    }
  };

  const addAlert = async () => {
    if (!userId || !newAlert.assetId || !newAlert.targetPrice) return;

    try {
      const asset = cryptoData.find(c => c.id === newAlert.assetId);
      if (!asset) return;

      const alertsRef = collection(db, 'users', userId, 'alerts');
      await addDoc(alertsRef, {
        assetId: newAlert.assetId,
        symbol: asset.symbol,
        targetPrice: parseFloat(newAlert.targetPrice),
        condition: newAlert.condition,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      setNewAlert({ assetId: '', targetPrice: '', condition: 'above' });
      setShowAddForm(false);

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch (error) {
      console.error('Error adding alert:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!userId) return;

    try {
      const alertRef = doc(db, 'users', userId, 'alerts', alertId);
      await deleteDoc(alertRef);
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-yellow/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-yellow-400" />
          Price Alerts
        </h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-600">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Asset</label>
              <select
                value={newAlert.assetId}
                onChange={(e) => setNewAlert({ ...newAlert, assetId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              >
                <option value="">Select an asset</option>
                {cryptoData.slice(0, 20).map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.symbol.toUpperCase()} - {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Condition</label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value as 'above' | 'below' })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Target Price</label>
                <Input
                  type="number"
                  step="0.000001"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  placeholder="0.00"
                  className="bg-gray-700 border-gray-600 text-white focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={addAlert}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Create Alert
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="text-text-secondary hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-text-secondary">No price alerts set</p>
            <p className="text-text-secondary text-sm mt-1">
              Get notified when prices hit your targets
            </p>
          </div>
        ) : (
          alerts.map(alert => {
            const asset = cryptoData.find(c => c.id === alert.assetId);
            if (!asset) return null;

            return (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                  alert.isActive 
                    ? 'bg-gray-800/30 border-gray-700/50' 
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {asset.symbol.toUpperCase()}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      {alert.condition === 'above' ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className="text-text-secondary">
                        {alert.condition} {formatCurrency(alert.targetPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-white text-sm">
                      {formatCurrency(asset.current_price)}
                    </p>
                    <p className={`text-xs ${
                      alert.isActive ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {alert.isActive ? 'Active' : 'Triggered'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;