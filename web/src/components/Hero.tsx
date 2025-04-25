"use client"

import React, { useEffect, useState } from 'react';
import { LifeBuoy, Coins, ShieldCheck, Trophy } from 'lucide-react';

export function Hero() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set draw date to next Sunday at midnight
    const calculateNextDrawDate = () => {
      const now = new Date();
      let daysUntilSunday = 7 - now.getDay();
      if (daysUntilSunday === 7) daysUntilSunday = 0;
      
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(0, 0, 0, 0);
      
      return nextSunday;
    };
    
    const nextDrawDate = calculateNextDrawDate();
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextDrawDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        const newDrawDate = calculateNextDrawDate();
        setCountdown({
          days: 7,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Join 10,000+ people already saving & winning
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Make Saving Fun.
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Win Weekly Prizes.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
            Deposit crypto into our secure pool, earn interest together, and get weekly chances to win big prizes. Your deposits are always safe and withdrawable.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <a 
              href="#dashboard" 
              className="w-full md:w-auto px-8 py-4 font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-lg md:text-xl"
            >
              Join the Pool
            </a>
            
            <a 
              href="#how-it-works" 
              className="w-full md:w-auto px-8 py-4 font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all shadow-lg border border-gray-200 dark:border-gray-700 text-lg md:text-xl"
            >
              See How It Works
            </a>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="text-yellow-500" size={28} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Next Pool Party
              </h2>
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/60 dark:to-cyan-900/60 rounded-xl p-3 md:p-4 text-center">
                  <div className="text-2xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{item.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full text-lg font-medium">
                🎉 Current Prize Pool: 24.5 ETH
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <LifeBuoy className="w-10 h-10 text-blue-500" />,
              title: 'Safe & Secure',
              description: 'Your deposits are protected by audited smart contracts. Withdraw anytime with no loss.'
            },
            {
              icon: <Trophy className="w-10 h-10 text-cyan-500" />,
              title: 'Weekly Pool Parties',
              description: 'Every Sunday, the pool\'s interest is awarded to lucky winners. The more you save, the better your odds!'
            },
            {
              icon: <Coins className="w-10 h-10 text-yellow-500" />,
              title: 'Earn While You Save',
              description: 'Your deposits generate interest through trusted DeFi protocols, funding the prize pool.'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg p-6 transition-transform hover:transform hover:scale-105"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}