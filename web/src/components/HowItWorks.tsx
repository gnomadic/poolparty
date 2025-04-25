"use client"
import React from 'react';
import { Wallet, Coins, Award, RefreshCw, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Wallet size={32} className="text-purple-500" />,
      title: "Connect & Deposit",
      description: "Connect your wallet and deposit ETH or stablecoins into the Pool.party vault."
    },
    {
      icon: <Coins size={32} className="text-pink-500" />,
      title: "Earn Yield",
      description: "Your deposits are deployed to various DeFi protocols to generate yield."
    },
    {
      icon: <Award size={32} className="text-teal-500" />,
      title: "Win Prizes",
      description: "The yield is collected and distributed as prizes in weekly drawings."
    },
    {
      icon: <RefreshCw size={32} className="text-purple-500" />,
      title: "Withdraw Anytime",
      description: "Withdraw your full deposit at any time with no loss of principal."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            How Pool.party Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A fun way to save while having a chance to win big, with zero risk to your principal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full transform transition-transform hover:scale-105">
                <div className="mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight size={24} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I lose my deposit?",
                answer: "No. Pool.party is a no-loss savings protocol. Your principal is always safe and can be withdrawn at any time."
              },
              {
                question: "How are winners selected?",
                answer: "Winners are selected using Chainlink VRF (Verifiable Random Function) to ensure fair and transparent drawings."
              },
              {
                question: "How often are prizes awarded?",
                answer: "Prizes are awarded weekly, every Sunday at midnight UTC."
              },
              {
                question: "Do bigger deposits have better chances?",
                answer: "Yes. Your chances of winning are proportional to the size of your deposit relative to the total pool."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}