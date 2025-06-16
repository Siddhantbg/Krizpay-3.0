'use client';

import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Tailwind CSS Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-semibold text-lg">Colors</h3>
          <div className="flex space-x-2 mt-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
          </div>
        </div>
        
        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-semibold text-lg">Spacing</h3>
          <div className="space-y-2 mt-2">
            <div className="h-2 bg-white/50 rounded"></div>
            <div className="h-2 bg-white/50 rounded w-3/4"></div>
            <div className="h-2 bg-white/50 rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="font-semibold text-lg">Custom Colors</h3>
          <div className="flex space-x-2 mt-2">
            <div className="w-6 h-6 bg-primary-purple rounded"></div>
            <div className="w-6 h-6 bg-primary-blue rounded"></div>
            <div className="w-6 h-6 bg-secondary-purple rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Primary Button
        </button>
        <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
          Secondary Button
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-dark-card rounded-lg">
        <p className="text-text-secondary">
          If you can see this styled content with proper colors, spacing, and responsive design, 
          then Tailwind CSS is working correctly!
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;