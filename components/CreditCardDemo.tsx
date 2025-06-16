'use client';

import React, { useState } from 'react';
import CreditCard3D from './CreditCard3D';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CreditCardDemo: React.FC = () => {
  const [cardData, setCardData] = useState({
    cardNumber: '4532 1234 5678 9012',
    cardHolder: 'JOHN DOE',
    expiryDate: '12/28'
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardInteraction = (event: MouseEvent) => {
    console.log('Card interaction:', { x: event.clientX, y: event.clientY });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">Premium Card Experience</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Experience our cutting-edge 3D credit card with real-time interactions and stunning visual effects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Card Display */}
          <div className="flex justify-center">
            <CreditCard3D
              cardNumber={cardData.cardNumber}
              cardHolder={cardData.cardHolder}
              expiryDate={cardData.expiryDate}
              theme={theme}
              onCardInteraction={handleCardInteraction}
            />
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-purple/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Customize Your Card</h3>
              
              <div className="space-y-6">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                  <Input
                    id="cardNumber"
                    value={cardData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="bg-dark-card border-gray-600 text-white"
                    maxLength={19}
                  />
                </div>

                {/* Card Holder */}
                <div className="space-y-2">
                  <Label htmlFor="cardHolder" className="text-white">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    value={cardData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                    className="bg-dark-card border-gray-600 text-white"
                    maxLength={26}
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-white">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={cardData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    className="bg-dark-card border-gray-600 text-white"
                    maxLength={5}
                  />
                </div>

                {/* Theme Toggle */}
                <div className="space-y-2">
                  <Label className="text-white">Theme</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex-1"
                    >
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex-1"
                    >
                      Light
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-primary-blue/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Interactive Features</h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>3D mouse tracking with perspective</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span>Animated liquid background layers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span>GPU-accelerated transforms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                  <span>Responsive touch interactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span>Real-time shine effects</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
            <h4 className="text-white font-semibold mb-2">Performance</h4>
            <p className="text-text-secondary text-sm">60fps animations with GPU acceleration and optimized transforms</p>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
            <h4 className="text-white font-semibold mb-2">Responsive</h4>
            <p className="text-text-secondary text-sm">Adaptive sizing and touch-optimized interactions for all devices</p>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
            <h4 className="text-white font-semibold mb-2">Secure</h4>
            <p className="text-text-secondary text-sm">Masked card numbers and secure data handling practices</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditCardDemo;