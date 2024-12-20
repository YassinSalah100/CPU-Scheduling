import React, { useEffect, useState, useCallback } from 'react';

const AdvancedCPUBackground = ({ children }) => {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [pulseStates, setPulseStates] = useState({});
  const [energyFlow, setEnergyFlow] = useState(0);

  // Generate more diverse particles
  const generateParticles = useCallback(() => {
    const colors = ['blue', 'purple', 'cyan', 'pink', 'green'];
    const shapes = ['circle', 'square', 'triangle', 'diamond'];
    
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 4 + 1,
      direction: Math.random() > 0.5 ? 1 : -1,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotationSpeed: Math.random() * 360,
      scale: Math.random() * 0.7 + 0.5,
      pulseSpeed: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
  }, []);

  // Simulate CPU activity with energy flow
  useEffect(() => {
    if (!mounted) return;

    const pulseInterval = setInterval(() => {
      setPulseStates(prev => {
        const newStates = { ...prev };
        const numCores = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numCores; i++) {
          const randomCore = Math.floor(Math.random() * 16);
          newStates[randomCore] = !prev[randomCore];
        }
        return newStates;
      });

      setEnergyFlow(prev => (prev + 1) % 360);
    }, 800);

    return () => clearInterval(pulseInterval);
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    generateParticles();
  }, [generateParticles]);

  const getParticleStyle = (particle) => {
    const baseStyle = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      opacity: particle.opacity,
      animation: `
        float${particle.direction > 0 ? '' : 'Reverse'} ${particle.speed}s infinite alternate,
        rotate ${particle.rotationSpeed}s linear infinite,
        pulse ${particle.pulseSpeed}s ease-in-out infinite
      `,
      transform: `scale(${particle.scale})`
    };

    const colorMap = {
      blue: 'rgba(147, 197, 253, 0.6)',
      purple: 'rgba(167, 139, 250, 0.6)',
      cyan: 'rgba(103, 232, 249, 0.6)',
      pink: 'rgba(244, 114, 182, 0.6)',
      green: 'rgba(110, 231, 183, 0.6)'
    };

    const shadowMap = {
      blue: '#60A5FA',
      purple: '#8B5CF6',
      cyan: '#22D3EE',
      pink: '#EC4899',
      green: '#34D399'
    };

    baseStyle.backgroundColor = colorMap[particle.color];
    baseStyle.boxShadow = `0 0 ${particle.size * 2}px ${shadowMap[particle.color]}`;

    if (particle.shape === 'square') {
      baseStyle.borderRadius = '2px';
    } else if (particle.shape === 'triangle') {
      baseStyle.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    } else if (particle.shape === 'diamond') {
      baseStyle.transform += ' rotate(45deg)';
    }

    return baseStyle;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-fuchsia-900">
      {/* Enhanced Hexagonal Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="hexagrid" width="50" height="43.4" patternUnits="userSpaceOnUse">
              <path
                d="M25 0l25 43.4h-50z m0 43.4l25-43.4h-50z"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagrid)" />
        </svg>
      </div>

      {/* Animated Energy Field */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `repeating-linear-gradient(
            ${energyFlow}deg,
            rgba(147, 197, 253, 0.1),
            rgba(167, 139, 250, 0.1) 20px,
            rgba(147, 197, 253, 0) 40px
          )`
        }}
      />

      {/* Enhanced Particles */}
      {mounted && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={getParticleStyle(particle)}
        />
      ))}

      {/* Advanced CPU Core Grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 border-4 border-cyan-400/20 rounded-xl grid grid-cols-4 gap-3 p-4 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-fuchsia-900/40 backdrop-blur-lg">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-lg overflow-hidden"
              style={{
                background: `linear-gradient(${energyFlow}deg, rgba(147, 197, 253, 0.1), rgba(167, 139, 250, 0.1))`
              }}
            >
              <div className={`absolute inset-0 transition-all duration-700 ${
                pulseStates[i] 
                  ? 'bg-gradient-to-br from-cyan-400/30 via-blue-400/20 to-purple-400/30 scale-110'
                  : 'bg-gradient-to-br from-transparent to-blue-400/10 scale-90'
              }`} />
              <div className={`w-full h-full flex items-center justify-center ${
                pulseStates[i] ? 'animate-ping' : ''
              }`}>
                <div className="w-3 h-3 rounded-full bg-cyan-400/70" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Data Flow */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="data-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(103, 232, 249, 0)" />
            <stop offset="50%" stopColor="rgba(103, 232, 249, 0.6)" />
            <stop offset="100%" stopColor="rgba(103, 232, 249, 0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 15 }).map((_, i) => (
          <React.Fragment key={i}>
            <line
              x1="0%"
              y1={`${(i + 1) * 6.67}%`}
              x2="100%"
              y2={`${(i + 1) * 6.67}%`}
              stroke="url(#data-flow)"
              strokeWidth="1"
              className="animate-dataflow"
              style={{
                animationDelay: `${i * 0.4}s`,
                animationDuration: '10s'
              }}
            />
            <line
              x1={`${(i + 1) * 6.67}%`}
              y1="0%"
              x2={`${(i + 1) * 6.67}%`}
              y2="100%"
              stroke="url(#data-flow)"
              strokeWidth="1"
              className="animate-dataflow-vertical"
              style={{
                animationDelay: `${i * 0.4}s`,
                animationDuration: '12s'
              }}
            />
          </React.Fragment>
        ))}
      </svg>

      {/* Content Container */}
      <div className="relative z-10 backdrop-blur-sm">
        {children}
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(10px, -20px) rotate(120deg) scale(1.1); }
          66% { transform: translate(-15px, 15px) rotate(240deg) scale(0.9); }
          100% { transform: translate(5px, -25px) rotate(360deg) scale(1); }
        }
        @keyframes floatReverse {
          0% { transform: translate(0, 0) rotate(360deg) scale(1); }
          33% { transform: translate(-10px, -20px) rotate(240deg) scale(1.1); }
          66% { transform: translate(15px, 15px) rotate(120deg) scale(0.9); }
          100% { transform: translate(-5px, -25px) rotate(0deg) scale(1); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1); }
        }
        @keyframes pulse {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
        .animate-dataflow {
          stroke-dasharray: 10 20;
          animation: dataflow 10s linear infinite;
        }
        .animate-dataflow-vertical {
          stroke-dasharray: 10 20;
          animation: dataflow-vertical 12s linear infinite;
        }
        @keyframes dataflow {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: -1000; }
        }
        @keyframes dataflow-vertical {
          0% { stroke-dashoffset: -1000; }
          100% { stroke-dashoffset: 1000; }
        }
      `}</style>
    </div>
  );
};

export default AdvancedCPUBackground;