'use client';

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Placeholder settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      transactions: true,
      marketing: false,
      security: true
    },
    appearance: {
      theme: 'dark',
      compactMode: false
    },
    security: {
      twoFactor: true,
      loginAlerts: true,
      transactionVerification: true
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      timeFormat: '24h'
    }
  });

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[keyof typeof prev]]
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-primary-purple/20">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/30 text-white' : 'text-text-secondary hover:text-white hover:bg-gray-800/50'}`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary-purple' : ''}`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-blue/20">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
                
                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6 mb-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-purple">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center text-white text-2xl font-bold">
                          {user?.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="text-text-secondary border-gray-700 hover:text-white hover:border-gray-600">
                      Change Photo
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <label className="text-text-secondary text-sm">Display Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.displayName || ''}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-text-secondary text-sm">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 focus:outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-text-secondary">Email cannot be changed (Google Sign-in)</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-text-secondary text-sm">Bio</label>
                      <textarea 
                        rows={3}
                        placeholder="Tell us about yourself"
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Notification Channels</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-primary-purple" />
                          <div>
                            <p className="text-white">Email Notifications</p>
                            <p className="text-text-secondary text-sm">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.notifications.email}
                            onChange={() => handleToggle('notifications', 'email')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-primary-blue" />
                          <div>
                            <p className="text-white">Push Notifications</p>
                            <p className="text-text-secondary text-sm">Receive on-device alerts</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.notifications.push}
                            onChange={() => handleToggle('notifications', 'push')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Notification Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Transaction Updates</p>
                          <p className="text-text-secondary text-sm">Deposits, withdrawals, trades</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.notifications.transactions}
                            onChange={() => handleToggle('notifications', 'transactions')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Security Alerts</p>
                          <p className="text-text-secondary text-sm">Login attempts, account changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.notifications.security}
                            onChange={() => handleToggle('notifications', 'security')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Marketing & Updates</p>
                          <p className="text-text-secondary text-sm">News, features, promotions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.notifications.marketing}
                            onChange={() => handleToggle('notifications', 'marketing')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Account Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Two-Factor Authentication</p>
                          <p className="text-text-secondary text-sm">Add an extra layer of security</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.security.twoFactor}
                            onChange={() => handleToggle('security', 'twoFactor')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Login Notifications</p>
                          <p className="text-text-secondary text-sm">Get alerted about new logins</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.security.loginAlerts}
                            onChange={() => handleToggle('security', 'loginAlerts')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Transaction Verification</p>
                          <p className="text-text-secondary text-sm">Require confirmation for transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.security.transactionVerification}
                            onChange={() => handleToggle('security', 'transactionVerification')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Device Management</h3>
                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <p className="text-white mb-2">Currently Active Devices</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                          <div>
                            <p className="text-white">Chrome on Windows</p>
                            <p className="text-text-secondary text-xs">Current device • Last active: Now</p>
                          </div>
                          <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Safari on iPhone</p>
                            <p className="text-text-secondary text-xs">Last active: 2 days ago</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
                      <Save className="w-4 h-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Payment Methods</h2>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-xl border border-dashed border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-white mb-2">No payment methods added yet</p>
                      <p className="text-text-secondary mb-4">Add a payment method to make deposits and withdrawals</p>
                      <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Appearance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <Moon className="w-5 h-5 text-gray-400" />
                            <Sun className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-white">Theme</p>
                            <p className="text-text-secondary text-sm">Choose your preferred theme</p>
                          </div>
                        </div>
                        <select 
                          value={settings.appearance.theme}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            appearance: {
                              ...prev.appearance,
                              theme: e.target.value
                            }
                          }))}
                          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-purple/50"
                        >
                          <option value="dark">Dark</option>
                          <option value="light">Light</option>
                          <option value="system">System Default</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white">Compact Mode</p>
                          <p className="text-text-secondary text-sm">Reduce spacing in UI elements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.appearance.compactMode}
                            onChange={() => handleToggle('appearance', 'compactMode')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-purple"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-text-secondary text-sm">Currency</label>
                        <select 
                          value={settings.preferences.currency}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              currency: e.target.value
                            }
                          }))}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-purple/50"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="JPY">JPY - Japanese Yen</option>
                          <option value="INR">INR - Indian Rupee</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-text-secondary text-sm">Language</label>
                        <select 
                          value={settings.preferences.language}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              language: e.target.value
                            }
                          }))}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-purple/50"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-text-secondary text-sm">Time Format</label>
                        <select 
                          value={settings.preferences.timeFormat}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              timeFormat: e.target.value
                            }
                          }))}
                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-purple/50"
                        >
                          <option value="12h">12-hour (AM/PM)</option>
                          <option value="24h">24-hour</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-opacity">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;