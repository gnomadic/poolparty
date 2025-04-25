"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, ArrowRight } from 'lucide-react';

export function Winners() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeWinnerIndex, setActiveWinnerIndex] = useState(0);
  
  // Mock data - would come from blockchain in a real implementation
  const recentWinners = [
    {
      address: "0x7a16fF8270133F063aAb6C9977183D9e72835428",
      prize: "12.8 ETH",
      date: "April 14, 2025",
      odds: "2.4%"
    },
    {
      address: "0x3bEcC1E99D604Dd19B49626E33A421Fa09C7c0D8",
      prize: "9.2 ETH",
      date: "April 7, 2025",
      odds: "1.8%"
    },
    {
      address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      prize: "11.5 ETH",
      date: "March 31, 2025",
      odds: "3.1%"
    }
  ];
  
  useEffect(() => {
    // Show confetti when component mounts
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const nextWinner = () => {
    setActiveWinnerIndex((prev) => (prev + 1) % recentWinners.length);
    setShowConfetti(true);
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  const prevWinner = () => {
    setActiveWinnerIndex((prev) => (prev - 1 + recentWinners.length) % recentWinners.length);
    setShowConfetti(true);
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  
  return (
    <section id="winners" className="py-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white flex items-center justify-center">
            <Trophy className="text-yellow-500 mr-2" />
            Recent Winners
          </h2>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 relative">
            <div className="flex justify-between mb-6">
              <button 
                onClick={prevWinner}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Previous winner"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Week of</p>
                <p className="font-medium text-gray-800 dark:text-white">{recentWinners[activeWinnerIndex].date}</p>
              </div>
              
              <button 
                onClick={nextWinner}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Next winner"
              >
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                <Trophy size={40} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-1 text-center text-gray-800 dark:text-white">
                Winner: {recentWinners[activeWinnerIndex].address.slice(0, 6)}...{recentWinners[activeWinnerIndex].address.slice(-4)}
              </h3>
              
              <p className="text-lg mb-4 text-center text-gray-600 dark:text-gray-300">
                Won <span className="font-bold text-purple-600 dark:text-purple-400">{recentWinners[activeWinnerIndex].prize}</span> with only a {recentWinners[activeWinnerIndex].odds} chance!
              </p>
              
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                This could be you next week!
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">All Recent Winners</h4>
              
              <div className="space-y-4">
                {recentWinners.map((winner, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                      index === activeWinnerIndex 
                        ? 'bg-purple-100 dark:bg-purple-900/30' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveWinnerIndex(index);
                      setShowConfetti(true);
                      
                      // Hide confetti after 3 seconds
                      setTimeout(() => {
                        setShowConfetti(false);
                      }, 3000);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <Trophy size={16} className={index === activeWinnerIndex ? "text-yellow-500" : "text-gray-500"} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{winner.address.slice(0, 6)}...{winner.address.slice(-4)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{winner.date}</p>
                      </div>
                    </div>
                    <div className="font-bold text-purple-600 dark:text-purple-400">
                      {winner.prize}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}