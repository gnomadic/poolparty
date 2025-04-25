"use client";

import React, { useEffect, useRef } from 'react';

export function Bubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = 600;
    
    const bubbles: Bubble[] = [];
    const bubbleCount = Math.floor(window.innerWidth / 40); // Reduced bubble count
    
    class Bubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      color: string;
      alpha: number;
      wobble: number;
      wobbleSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.radius = Math.random() * 15 + 8; // Slightly smaller bubbles
        this.speedY = Math.random() * 1.5 + 0.3; // Slower movement
        this.alpha = 0.08 + Math.random() * 0.15; // More transparent
        this.wobble = 0;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        
        // Create blue/cyan bubbles for pool theme
        const hue = Math.random() * 40 + 180; // Range from cyan to blue
        const sat = Math.random() * 40 + 60;
        const light = Math.random() * 20 + 70;
        this.color = `hsla(${hue}, ${sat}%, ${light}%, ${this.alpha})`;
      }
      
      update() {
        this.y -= this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5; // Add gentle side-to-side motion
        
        if (this.y < -this.radius * 2) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + this.radius;
          this.wobble = 0;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add shine effect
        const gradient = ctx.createRadialGradient(
          this.x - this.radius * 0.3,
          this.y - this.radius * 0.3,
          this.radius * 0.1,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, `hsla(0, 0%, 100%, ${this.alpha * 2})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
    
    // Initialize bubbles
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw(ctx);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0 opacity-60"
    />
  );
}