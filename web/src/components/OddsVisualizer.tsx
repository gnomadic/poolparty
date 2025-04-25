import React, { useEffect, useRef, useState } from 'react';
import { PieChart } from 'lucide-react';

type OddsVisualizerProps = {
  currentDeposit: number;
  totalPoolSize: number;
  prizePool: number;
};

export function OddsVisualizer({ currentDeposit, totalPoolSize, prizePool }: OddsVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [winChance, setWinChance] = useState(0);
  
  useEffect(() => {
    // Calculate win chance percentage
    const chance = (currentDeposit / totalPoolSize) * 100;
    setWinChance(parseFloat(chance.toFixed(2)));
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 200;
    canvas.height = 200;
    
    // Draw the odds visualization pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    // Your portion (in purple)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX, 
      centerY, 
      radius, 
      0, 
      (Math.PI * 2) * (chance / 100), 
      false
    );
    ctx.fillStyle = '#8B5CF6'; // purple-500
    ctx.fill();
    
    // Rest of the pool (in gray)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX, 
      centerY, 
      radius, 
      (Math.PI * 2) * (chance / 100), 
      Math.PI * 2, 
      false
    );
    ctx.fillStyle = '#D1D5DB'; // gray-300
    ctx.fill();
    
    // Add inner circle (white cutout)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2, false);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    // Add text in the middle
    ctx.fillStyle = '#1F2937'; // gray-800
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${chance.toFixed(2)}%`, centerX, centerY);
    
  }, [currentDeposit, totalPoolSize]);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 flex flex-col items-center">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white flex items-center">
        <PieChart size={20} className="mr-2 text-purple-500" />
        Your Win Chance
      </h3>
      
      <div className="mb-4">
        <canvas ref={canvasRef} width="200" height="200" />
      </div>
      
      <div className="w-full space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Your Deposit:</span>
          <span className="font-medium text-gray-800 dark:text-white">{currentDeposit} ETH</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total Pool Size:</span>
          <span className="font-medium text-gray-800 dark:text-white">{totalPoolSize} ETH</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Current Prize:</span>
          <span className="font-medium text-purple-600 dark:text-purple-400">{prizePool} ETH</span>
        </div>
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600 mt-2">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Deposit more to increase your chances!
          </div>
        </div>
      </div>
    </div>
  );
}