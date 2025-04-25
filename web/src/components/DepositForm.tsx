import React from 'react';
import { ArrowRight } from 'lucide-react';

type Pool = {
  id: string;
  name: string;
  entryAmount: string;
  totalParticipants: number;
  prizePool: string;
  treasury: string;
  description: string;
};

type DepositFormProps = {
  selectedPool: Pool;
};

export function DepositForm({ selectedPool }: DepositFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would connect to a wallet and execute the transaction
    alert(`Joining ${selectedPool.name} with ${selectedPool.entryAmount} ETH`);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          Join {selectedPool.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Fixed entry of {selectedPool.entryAmount} ETH required to join this pool.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Entry Amount
          </label>
          <div className="flex rounded-lg overflow-hidden shadow-sm">
            <input
              type="text"
              value={`${selectedPool.entryAmount} ETH`}
              disabled
              className="flex-1 p-3 border-0 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>
        
        <div className="bg-cyan-100 dark:bg-cyan-900/30 p-4 rounded-lg mb-6 space-y-2">
          <p className="text-sm text-cyan-700 dark:text-cyan-300">
            <span className="font-medium">Pool Details:</span>
          </p>
          <ul className="text-sm text-cyan-700 dark:text-cyan-300 space-y-1">
            <li>• Fixed entry amount of {selectedPool.entryAmount} ETH</li>
            <li>• {selectedPool.totalParticipants} current participants</li>
            <li>• Top 10% of participants win weekly</li>
            <li>• Current prize pool: {selectedPool.prizePool} ETH</li>
            <li>• Contributing to treasury: {selectedPool.treasury} ETH</li>
          </ul>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg shadow transition-all transform hover:scale-105 flex items-center justify-center"
        >
          Join Pool
          <ArrowRight size={18} className="ml-2" />
        </button>
      </form>
    </div>
  );
}