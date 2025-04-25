import React, { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

type ConnectWalletButtonProps = {
  mobile?: boolean;
};

export function ConnectWalletButton({ mobile = false }: ConnectWalletButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mock wallet address - in real implementation this would come from wallet connection
  const walletAddress = "0x1234...5678";
  
  const handleConnect = () => {
    // In a real implementation, this would trigger wallet connection
    setIsConnected(true);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    setIsDropdownOpen(false);
  };
  
  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className={`flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full transition-all transform hover:scale-105 shadow-md hover:shadow-lg ${
          mobile ? 'w-full' : ''
        }`}
      >
        <Wallet size={18} />
        Connect Wallet
      </button>
    );
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full transition-all shadow-md hover:shadow-lg ${
          mobile ? 'w-full' : ''
        }`}
      >
        <Wallet size={18} />
        {walletAddress}
        {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}