'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CryptoDashboard from '@/components/crypto/CryptoDashboard';

export default function CryptoDashboardPage() {
  return (
    <ProtectedRoute>
      <CryptoDashboard />
    </ProtectedRoute>
  );
}