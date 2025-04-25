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
    const bubbleCount = Math.floor(window.innerWidth / 30); // Responsive bubble count

    class Bubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        if (canvas) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + Math.random() * 100;
        } else {
          this.x = Math.random() * window.innerWidth;
          this.y = 600 + Math.random() * 100;
        }
        this.radius = Math.random() * 20 + 10;
        this.speedY = Math.random() * 2 + 0.5;
        this.alpha = 0.1 + Math.random() * 0.3; // Semi-transparent

        // Create pastel colors in the purple/pink palette
        const hue = Math.random() * 60 + 280; // Range from purple to pink
        const sat = Math.random() * 40 + 60; // High saturation
        const light = Math.random() * 20 + 70; // Light colors
        this.color = `hsla(${hue}, ${sat}%, ${light}%, ${this.alpha})`;
      }

      update() {
        this.y -= this.speedY;

        // Reset bubble when it goes off screen
        if (this.y < -this.radius * 2) {
          if (canvas) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.radius;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
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
      className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
    />
  );
}