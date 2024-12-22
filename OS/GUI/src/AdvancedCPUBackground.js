import React, { useEffect, useState, useCallback } from 'react';

const AdvancedCPUBackground = ({ children }) => {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [pulseStates, setPulseStates] = useState({});
  const [energyFlow, setEnergyFlow] = useState(0);

  const generateParticles = useCallback(() => {
    // More subtle, CPU-themed particles
    const colors = [
      'slate', // Circuit board traces
      'cyan',  // Processing signals
      'indigo' // Data flow
    ];
    
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // Smaller particles
      speed: Math.random() * 2 + 1, // Slower movement
      direction: Math.random() > 0.5 ? 1 : -1,
      opacity: Math.random() * 0.3 + 0.1, // More subtle
      color: colors[Math.floor(Math.random() * colors.length)],
      pulseSpeed: Math.random() * 3 + 2
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const pulseInterval = setInterval(() => {
      setPulseStates(prev => {
        const newStates = { ...prev };
        const numCores = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numCores; i++) {
          const randomCore = Math.floor(Math.random() * 16);
          newStates[randomCore] = !prev[randomCore];
        }
        return newStates;
      });

      setEnergyFlow(prev => (prev + 0.5) % 360);
    }, 1000);

    return () => clearInterval(pulseInterval);
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    generateParticles();
  }, [generateParticles]);

  const getParticleStyle = (particle) => {
    const colorMap = {
      slate: 'rgba(148, 163, 184, 0.2)',
      cyan: 'rgba(34, 211, 238, 0.15)',
      indigo: 'rgba(129, 140, 248, 0.15)'
    };

    return {
      position: 'absolute',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      opacity: particle.opacity,
      backgroundColor: colorMap[particle.color],
      borderRadius: '50%',
      animation: `
        float${particle.direction > 0 ? '' : 'Reverse'} ${particle.speed}s infinite alternate,
        pulse ${particle.pulseSpeed}s ease-in-out infinite
      `,
      transition: 'all 0.5s ease-in-out'
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Circuit Board Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="circuit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M20 0v40M0 20h40M10 0v40M30 0v40M0 10h40M0 30h40"
                stroke="rgba(226, 232, 240, 0.3)"
                strokeWidth="0.5"
                fill="none"
              />
              <circle cx="10" cy="10" r="1" fill="rgba(226, 232, 240, 0.5)" />
              <circle cx="30" cy="10" r="1" fill="rgba(226, 232, 240, 0.5)" />
              <circle cx="10" cy="30" r="1" fill="rgba(226, 232, 240, 0.5)" />
              <circle cx="30" cy="30" r="1" fill="rgba(226, 232, 240, 0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-grid)" />
        </svg>
      </div>

      {/* Subtle Data Flow Lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="data-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
              <stop offset="50%" stopColor="rgba(34, 211, 238, 0.1)" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
            </linearGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="0%"
              y1={`${(i + 1) * 12.5}%`}
              x2="100%"
              y2={`${(i + 1) * 12.5}%`}
              stroke="url(#data-flow)"
              strokeWidth="1"
              className="animate-dataflow"
              style={{
                animationDelay: `${i * 0.8}s`,
                animationDuration: '15s'
              }}
            />
          ))}
        </svg>
      </div>

      {/* Processing Core Visualization */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-96 h-96 grid grid-cols-4 gap-4 p-6">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-lg overflow-hidden border border-cyan-900/20"
            >
              <div className={`absolute inset-0 transition-opacity duration-1000 ${
                pulseStates[i] ? 'opacity-40' : 'opacity-10'
              } bg-gradient-to-br from-cyan-500 to-transparent`} />
              <div className="w-full h-full flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full bg-cyan-400 transition-all duration-500 ${
                  pulseStates[i] ? 'scale-125 opacity-100' : 'scale-100 opacity-40'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      {mounted && particles.map((particle) => (
        <div
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Animation Definitions */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(5px, -5px); }
        }
        @keyframes floatReverse {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-5px, -5px); }
        }
        @keyframes pulse {
          0% { opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
        .animate-dataflow {
          stroke-dasharray: 10 30;
          animation: dataflow 15s linear infinite;
        }
        @keyframes dataflow {
          to { stroke-dashoffset: 400; }
        }
      `}</style>
    </div>
  );
};

export default AdvancedCPUBackground;