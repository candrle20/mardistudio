'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SceneCanvas = dynamic(() => import('../components/landing/SceneCanvas').then(mod => ({ default: mod.SceneCanvas })), {
  ssr: false
});

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(Math.max(scrolled / scrollHeight, 0), 1);
      setScrollProgress(progress);
      
      // Show button when user has scrolled 80% or more
      setShowButton(progress >= 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[300vh] overflow-hidden bg-gradient-to-b from-sky-300 via-blue-200 to-blue-100">
      {/* Three.js Canvas - Fixed position */}
      <div className="fixed inset-0 z-0">
        <SceneCanvas />
      </div>

      {/* Scrollable content area to enable scrolling */}
      <div className="relative z-10 w-full h-full">
        {/* This creates the scrollable height */}
        <div className="h-[300vh]">
          {/* Entry message */}
          <div className="absolute top-[10vh] left-1/2 transform -translate-x-1/2 text-white text-center pointer-events-none transition-opacity duration-500" style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}>
            <p className="text-lg font-medium drop-shadow-lg">Scroll down to explore the forest</p>
          </div>
          
          {/* Studio Button - appears at the end */}
          <div 
            className={`fixed bottom-[10vh] left-1/2 transform -translate-x-1/2 z-30 transition-all duration-700 ${
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
          >
            <Link href="/studio/new">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xl font-semibold rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:from-emerald-500 hover:to-teal-500">
                <span className="relative z-10 flex items-center gap-3">
                  <span>Enter Mardi Studio</span>
                  <svg 
                    className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* Shine effect */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
