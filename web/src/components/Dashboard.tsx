"use client";

import React, { useState } from 'react';
import { Wallet, ArrowRight, DollarSign, PieChart, BarChart4 } from 'lucide-react';
import { DepositForm } from './DepositForm';
import { OddsVisualizer } from './OddsVisualizer';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'stats'>('deposit');
  
  // Mock data - would come from blockchain in a real implementation
  const mockData = {
    currentDeposit: '5.0 ETH',
    totalPoolSize: '520 ETH',
    yourWinChance: '0.96%',
    prizePool: '24.5 ETH',
    yourTransactions: [
      { type: 'Deposit', amount: '3.0 ETH', date: '2025-04-10', status: 'Completed' },
      { type: 'Deposit', amount: '2.0 ETH', date: '2025-04-05', status: 'Completed' },
      { type: 'Withdrawal', amount: '1.0 ETH', date: '2025-03-28', status: 'Completed' },
      { type: 'Deposit', amount: '1.0 ETH', date: '2025-03-20', status: 'Completed' }
    ]
  };

  return (
    <section id="dashboard" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Your Pool.party Dashboard
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'deposit'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('deposit')}
              >
                Deposit & Withdraw
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('stats')}
              >
                Your Stats & Transactions
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'deposit' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DepositForm />
                  <OddsVisualizer 
                    currentDeposit={5}
                    totalPoolSize={520}
                    prizePool={24.5}
                  />
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                      { 
                        icon: <DollarSign className="text-purple-500" size={24} />,
                        label: 'Your Deposit',
                        value: mockData.currentDeposit
                      },
                      { 
                        icon: <PieChart className="text-pink-500" size={24} />,
                        label: 'Win Chance',
                        value: mockData.yourWinChance
                      },
                      { 
                        icon: <BarChart4 className="text-teal-500" size={24} />,
                        label: 'Prize Pool',
                        value: mockData.prizePool
                      }
                    ].map((stat, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
                        <div className="mr-4">
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                          <p className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {mockData.yourTransactions.map((tx, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${tx.type === 'Deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {tx.type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-800 dark:text-white">{tx.amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 dark:text-gray-300">{tx.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
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