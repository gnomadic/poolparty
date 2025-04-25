import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function DepositForm() {
  const [isDeposit, setIsDeposit] = useState(true);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ETH');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would connect to a wallet and execute the transaction
    alert(`${isDeposit ? 'Deposit' : 'Withdrawal'} of ${amount} ${currency} initiated`);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => setIsDeposit(true)}
          className={`py-2 px-4 rounded-lg font-medium ${
            isDeposit 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setIsDeposit(false)}
          className={`py-2 px-4 rounded-lg font-medium ${
            !isDeposit 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          Withdraw
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isDeposit ? 'Deposit Amount' : 'Withdraw Amount'}
          </label>
          <div className="flex rounded-lg overflow-hidden shadow-sm">
            <input
              type="number"
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 p-3 border-0 focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
              required
              min="0.01"
              step="0.01"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 text-sm border-0 focus:ring-0"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>
        
        {isDeposit && (
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mb-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              By depositing, you'll automatically be entered in all future draws until you withdraw.
              Your deposit is safe and can be withdrawn at any time.
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow transition-all transform hover:scale-105 flex items-center justify-center"
        >
          {isDeposit ? (
            <>
              Deposit Now
              <ArrowRight size={18} className="ml-2" />
            </>
          ) : (
            <>
              <ArrowLeft size={18} className="mr-2" />
              Withdraw Funds
            </>
          )}
        </button>
        
        {isDeposit && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Your current balance: 5.0 ETH
          </div>
        )}
      </form>
    </div>
  );
}