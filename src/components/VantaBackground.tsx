'use client';

import { useEffect, useRef } from 'react';

// Add type declarations for Vanta.js
declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

interface VantaBackgroundProps {
  color?: number;
  backgroundColor?: number;
  points?: number;
  maxDistance?: number;
  spacing?: number;
  showDots?: boolean;
}

export default function VantaBackground({
  color = 0x00b4d8,
  backgroundColor = 0xffffff,
  points = 9.00,
  maxDistance = 25.00,
  spacing = 18.00,
  showDots = false
}: VantaBackgroundProps) {
  const vantaEffect = useRef<any>(null);
  const scriptsLoaded = useRef(false);

  useEffect(() => {
    // Only load scripts if they haven't been loaded yet
    if (!scriptsLoaded.current) {
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      threeScript.async = true;
      document.body.appendChild(threeScript);

      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
      vantaScript.async = true;
      document.body.appendChild(vantaScript);

      scriptsLoaded.current = true;
    }

    // Initialize Vanta effect after scripts are loaded
    const initVanta = () => {
      if (window.VANTA) {
        vantaEffect.current = window.VANTA.NET({
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          scale: 1.00,
          scaleMobile: 1.00,
          color,
          backgroundColor,
          points,
          maxDistance,
          spacing,
          showDots
        });
      }
    };

    // Check if scripts are loaded
    const checkScripts = setInterval(() => {
      if (window.THREE && window.VANTA) {
        clearInterval(checkScripts);
        initVanta();
      }
    }, 100);

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      clearInterval(checkScripts);
    };
  }, [color, backgroundColor, points, maxDistance, spacing, showDots]);

  return (
    <>
      <div id="vanta-bg" className="fixed inset-0 z-[-1]"></div>
      <div className="fixed inset-0 bg-white/20 z-[-1]"></div>
    </>
  );
} 