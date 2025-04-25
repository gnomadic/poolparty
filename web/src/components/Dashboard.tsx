"use client";

import React, { useState } from 'react';
import { Wallet, ArrowRight, DollarSign, PieChart, BarChart4, Users } from 'lucide-react';
import { DepositForm } from './DepositForm';
import { OddsVisualizer } from './OddsVisualizer';

// Mock pool data - would come from blockchain in real implementation
const POOLS = [
  {
    id: 'beginner',
    name: 'Kiddie Pool',
    entryAmount: '0.1',
    totalParticipants: 120,
    prizePool: '2.4',
    treasury: '0.12',
    description: 'Perfect for testing the waters! Low entry, still fun.',
  },
  {
    id: 'intermediate',
    name: 'Leisure Pool',
    entryAmount: '0.5',
    totalParticipants: 85,
    prizePool: '8.5',
    treasury: '0.425',
    description: 'For regular swimmers who want bigger waves.',
  },
  {
    id: 'advanced',
    name: 'Deep End',
    entryAmount: '1.0',
    totalParticipants: 45,
    prizePool: '9.0',
    treasury: '0.45',
    description: 'The big pool for serious swimmers!',
  }
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'stats'>('deposit');
  const [selectedPool, setSelectedPool] = useState(POOLS[0]);
  
  // Mock data for user's positions
  const mockData = {
    activePools: [
      { pool: 'Kiddie Pool', amount: '0.1 ETH', joinDate: '2025-04-10' },
      { pool: 'Leisure Pool', amount: '0.5 ETH', joinDate: '2025-04-05' }
    ],
    yourTransactions: [
      { type: 'Join Pool', pool: 'Kiddie Pool', amount: '0.1 ETH', date: '2025-04-10', status: 'Completed' },
      { type: 'Join Pool', pool: 'Leisure Pool', amount: '0.5 ETH', date: '2025-04-05', status: 'Completed' },
      { type: 'Win', pool: 'Kiddie Pool', amount: '0.24 ETH', date: '2025-03-28', status: 'Claimed' }
    ]
  };

  return (
    <section id="dashboard" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Pick Your Pool 🏊‍♂️
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {POOLS.map((pool) => (
              <button
                key={pool.id}
                onClick={() => setSelectedPool(pool)}
                className={`p-6 rounded-xl transition-all ${
                  selectedPool.id === pool.id
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white transform scale-105 shadow-lg'
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{pool.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} />
                  <span className="font-medium">{pool.entryAmount} ETH Entry</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} />
                  <span>{pool.totalParticipants} Swimmers</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart4 size={18} />
                  <span>Prize Pool: {pool.prizePool} ETH</span>
                </div>
                <p className="text-sm mt-2 opacity-90">{pool.description}</p>
              </button>
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'deposit'
                    ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('deposit')}
              >
                Join Pool
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('stats')}
              >
                Your Pools & Stats
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'deposit' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DepositForm selectedPool={selectedPool} />
                  <OddsVisualizer 
                    currentDeposit={Number(selectedPool.entryAmount)}
                    totalPoolSize={Number(selectedPool.prizePool)}
                    prizePool={Number(selectedPool.prizePool) * 0.1}
                    totalWinners={Math.ceil(selectedPool.totalParticipants * 0.1)}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Active Pools</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {mockData.activePools.map((position, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-lg mb-2">{position.pool}</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="font-medium">{position.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                          <span>{position.joinDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Transaction History</h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pool</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {mockData.yourTransactions.map((tx, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                tx.type === 'Win' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                              }`}>
                                {tx.type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-800 dark:text-white">{tx.pool}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-800 dark:text-white">{tx.amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 dark:text-gray-300">{tx.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                tx.status === 'Completed'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}