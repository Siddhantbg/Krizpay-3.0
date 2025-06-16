'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  CreditCard, 
  Shield, 
  LogOut, 
  ChevronDown,
  Loader2
} from 'lucide-react';

const UserMenu: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 h-auto p-2 hover:bg-gray-800/50 focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-dark-bg rounded-xl"
          disabled={loading || isSigningOut}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={user.photoURL || undefined} 
              alt={user.displayName || 'User avatar'} 
            />
            <AvatarFallback className="bg-gradient-to-r from-primary-purple to-primary-blue text-white text-sm font-semibold">
              {getUserInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-white text-sm font-medium leading-none">
              {user.displayName || 'User'}
            </p>
            <p className="text-text-secondary text-xs leading-none mt-1">
              {user.email}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 bg-dark-card border-gray-700 shadow-xl" 
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={user.photoURL || undefined} 
                  alt={user.displayName || 'User avatar'} 
                />
                <AvatarFallback className="bg-gradient-to-r from-primary-purple to-primary-blue text-white font-semibold">
                  {getUserInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-text-secondary text-sm truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem className="text-white hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
          <User className="w-4 h-4 mr-3" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
          <CreditCard className="w-4 h-4 mr-3" />
          <span>Payment Methods</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
          <Shield className="w-4 h-4 mr-3" />
          <span>Security</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 focus:bg-gray-800 cursor-pointer">
          <Settings className="w-4 h-4 mr-3" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem 
          className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 mr-3 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-3" />
          )}
          <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;