import React, { useState } from 'react';
import {  BarChart3, Play,Plus, Minus, Save, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AdvancedCPUBackground from './AdvancedCPUBackground';

class SchedulingAlgorithm {
  // First Come First Serve (FCFS)
  static FCFS(processes) {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    
    return this.calculateMetrics(sortedProcesses.map(process => {
      const startTime = Math.max(currentTime, process.arrivalTime);
      const waitingTime = startTime - process.arrivalTime;
      currentTime = startTime + process.burstTime;
      
      return {
        ...process,
        startTime,
        completionTime: currentTime,
        waitingTime,
        turnaroundTime: waitingTime + process.burstTime,
        responseTime: waitingTime
      };
    }));
  }

  // Non-preemptive Shortest Job First (SJF)
  static SJF(processes) {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = sortedProcesses[0].arrivalTime;
    let completed = [];
    let remaining = [...sortedProcesses];

    while (remaining.length > 0) {
      // Find available processes
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }

      // Select shortest job
      const shortestJob = available.reduce((prev, curr) => 
        prev.burstTime < curr.burstTime ? prev : curr
      );

      // Process the job
      const waitingTime = currentTime - shortestJob.arrivalTime;
      completed.push({
        ...shortestJob,
        startTime: currentTime,
        completionTime: currentTime + shortestJob.burstTime,
        waitingTime,
        turnaroundTime: waitingTime + shortestJob.burstTime,
        responseTime: waitingTime
      });

      currentTime += shortestJob.burstTime;
      remaining = remaining.filter(p => p.id !== shortestJob.id);
    }

    return this.calculateMetrics(completed);
  }

  // Preemptive Shortest Job First (SRTF)
  static SRTF(processes) {
    const events = [];
    const completed = [];
    let currentTime = 0;
    let remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime, startTime: null }));

    while (remaining.length > 0) {
      // Find available processes
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }

      // Select process with shortest remaining time
      const shortestJob = available.reduce((prev, curr) => 
        prev.remainingTime < curr.remainingTime ? prev : curr
      );

      // Record first response time if not started
      if (shortestJob.startTime === null) {
        shortestJob.startTime = currentTime;
        shortestJob.responseTime = currentTime - shortestJob.arrivalTime;
      }

      // Process for 1 time unit
      events.push({ processId: shortestJob.id, startTime: currentTime, endTime: currentTime + 1 });
      shortestJob.remainingTime--;
      currentTime++;

      // Check if process is completed
      if (shortestJob.remainingTime === 0) {
        completed.push({
          ...shortestJob,
          completionTime: currentTime,
          turnaroundTime: currentTime - shortestJob.arrivalTime,
          waitingTime: currentTime - shortestJob.arrivalTime - shortestJob.burstTime
        });
        remaining = remaining.filter(p => p.id !== shortestJob.id);
      }
    }

    return {
      ...this.calculateMetrics(completed),
      processResults: completed,
      events // For visualization
    };
  }

  // Round Robin
  static RoundRobin(processes, timeQuantum = 2) {
    const events = [];
    const completed = [];
    let currentTime = 0;
    let remaining = processes.map(p => ({ 
      ...p, 
      remainingTime: p.burstTime, 
      startTime: null,
      firstResponse: null
    }));
    
    while (remaining.length > 0) {
      let processed = false;
      
      for (let i = 0; i < remaining.length; i++) {
        const process = remaining[i];
        
        if (process.arrivalTime <= currentTime) {
          // Record first response time
          if (process.firstResponse === null) {
            process.firstResponse = currentTime;
            process.responseTime = currentTime - process.arrivalTime;
          }

          const executeTime = Math.min(timeQuantum, process.remainingTime);
          events.push({
            processId: process.id,
            startTime: currentTime,
            endTime: currentTime + executeTime
          });

          process.remainingTime -= executeTime;
          currentTime += executeTime;
          processed = true;

          if (process.remainingTime === 0) {
            completed.push({
              ...process,
              completionTime: currentTime,
              turnaroundTime: currentTime - process.arrivalTime,
              waitingTime: currentTime - process.arrivalTime - process.burstTime
            });
            remaining.splice(i, 1);
            i--;
          }
        }
      }

      if (!processed) {
        currentTime++;
      }
    }

    return {
      ...this.calculateMetrics(completed),
      processResults: completed,
      events // For visualization
    };
  }

  // Priority Scheduling (Non-preemptive)
  static Priority(processes) {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = sortedProcesses[0].arrivalTime;
    let completed = [];
    let remaining = [...sortedProcesses];

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }

      // Select highest priority process (lower number = higher priority)
      const highestPriority = available.reduce((prev, curr) => 
        prev.priority < curr.priority ? prev : curr
      );

      const waitingTime = currentTime - highestPriority.arrivalTime;
      completed.push({
        ...highestPriority,
        startTime: currentTime,
        completionTime: currentTime + highestPriority.burstTime,
        waitingTime,
        turnaroundTime: waitingTime + highestPriority.burstTime,
        responseTime: waitingTime
      });

      currentTime += highestPriority.burstTime;
      remaining = remaining.filter(p => p.id !== highestPriority.id);
    }

    return this.calculateMetrics(completed);
  }

  // Helper method to calculate average metrics
  static calculateMetrics(results) {
    return {
      processResults: results,
      avgWaitingTime: this.calculateAverage(results, 'waitingTime'),
      avgTurnaroundTime: this.calculateAverage(results, 'turnaroundTime'),
      avgResponseTime: this.calculateAverage(results, 'responseTime')
    };
  }

  static calculateAverage(results, key) {
    return results.reduce((sum, proc) => sum + proc[key], 0) / results.length;
  }
}
// STEP 3: Replace the entire ProcessGanttChart component
const ProcessGanttChart = ({ processes, simulationResults, algorithm }) => {
  if (!simulationResults || !processes || processes.length === 0) return null;

  const getChartData = () => {
    try {
      if (algorithm === 'FCFS' || algorithm === 'SJF (Non-Preemptive)' || algorithm === 'Priority') {
        if (!Array.isArray(simulationResults.processResults)) {
          console.error('Process results is not an array:', simulationResults.processResults);
          return [];
        }

        return simulationResults.processResults
          .sort((a, b) => a.startTime - b.startTime)
          .map(proc => ({
            name: `P${proc.id}`,
            executionStart: proc.startTime,
            executionEnd: proc.completionTime,
            waitingTime: proc.waitingTime,
            burstTime: proc.burstTime,
            processColor: `hsl(${(proc.id * 137) % 360}, 70%, 50%)`
          }));
      } else {
        if (!Array.isArray(simulationResults.events)) {
          console.error('Events is not an array:', simulationResults.events);
          return [];
        }

        return simulationResults.events
          .sort((a, b) => a.startTime - b.startTime)
          .map(event => ({
            name: `P${event.processId}`,
            executionStart: event.startTime,
            executionEnd: event.endTime,
            processColor: `hsl(${(event.processId * 137) % 360}, 70%, 50%)`
          }));
      }
    } catch (error) {
      console.error('Error in getChartData:', error);
      return [];
    }
  };

  const chartData = getChartData();
  const maxTime = Math.max(...chartData.map(d => d.executionEnd));

  // Create execution sequence with repetitions
  const executionSequence = chartData.map((item, index) => ({
    name: item.name,
    start: item.executionStart,
    end: item.executionEnd,
    processColor: item.processColor,
    sequenceId: index // Add a unique sequence ID for each execution
  }));

  // Sort by execution start time
  executionSequence.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return a.sequenceId - b.sequenceId;
  });

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-6 mt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800">
        <BarChart3 className="text-blue-600" /> Process Execution Timeline
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
          >
            <defs>
              {processes.map((proc) => (
                <linearGradient
                  key={proc.id}
                  id={`processGradient${proc.id}`}
                  x1="0" y1="0" x2="0" y2="1"
                >
                  <stop offset="5%" stopColor={`hsl(${(proc.id * 137) % 360}, 70%, 50%)`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`hsl(${(proc.id * 137) % 360}, 70%, 50%)`} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="opacity-50" />
            <XAxis
              dataKey="executionStart"
              type="number"
              domain={[0, maxTime]}
              tickCount={10}
              label={{ value: 'Time Units', position: 'bottom', offset: 20, style: { fill: '#4A5568', fontWeight: 'bold' } }}
            />
            <YAxis
              type="category"
              dataKey="name"
              label={{ value: 'Process ID', angle: -90, position: 'insideLeft', offset: -40, style: { fill: '#4A5568', fontWeight: 'bold' } }}
              tick={{ fill: '#4A5568', fontWeight: 'bold' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border rounded-lg shadow-lg">
                      <p className="font-bold text-lg text-blue-800 mb-2">{data.name}</p>
                      <div className="space-y-1">
                        <p className="text-gray-700">
                          <span className="font-semibold">Start:</span> {data.executionStart}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">End:</span> {data.executionEnd}
                        </p>
                        {data.waitingTime !== undefined && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Waiting Time:</span> {data.waitingTime}
                          </p>
                        )}
                        {data.burstTime !== undefined && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Burst Time:</span> {data.burstTime}
                          </p>
                        )}
                        <p className="text-gray-700">
                          <span className="font-semibold">Duration:</span> {data.executionEnd - data.executionStart}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px', fontWeight: 'bold' }} />
            {chartData.map((entry, index) => (
              <Area
                key={index}
                type="stepAfter"
                dataKey="executionEnd"
                stroke={entry.processColor}
                fill={`url(#processGradient${entry.name.slice(1)})`}
                fillOpacity={0.8}
                strokeWidth={2}
                stackId="1"
                name={entry.name}
                connectNulls={true}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Updated Process Timeline Legend with Execution Sequence */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h4 className="font-bold text-gray-700 mb-2">Execution Sequence:</h4>
        <div className="flex flex-wrap gap-4">
          {executionSequence.map((process, index) => (
            <div key={`${process.name}-${index}`} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: process.processColor }} />
              <span className="font-medium">{process.name}</span>
              <span className="text-gray-500 text-sm">({process.start} - {process.end})</span>
              {index < executionSequence.length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Advanced CPU Scheduling Simulator
const CPUSchedulerSimulator = () => {
  
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [processes, setProcesses] = useState([
    { id: 1, arrivalTime: 0, burstTime: 10, priority: 3 },
    { id: 2, arrivalTime: 1, burstTime: 5, priority: 1 },
    { id: 3, arrivalTime: 3, burstTime: 8, priority: 2 }
  ]);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [timeQuantum, setTimeQuantum] = useState(2); // Add time quantum state

   // Add this new constant
   const showPriority = algorithm === 'Priority';
   const showTimeQuantum = algorithm === 'Round Robin'; // Add this line

  // Advanced Simulation Method
  const simulateScheduling = () => {
    setIsSimulating(true);
    
    // Sort processes by arrival time to ensure correct simulation
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
     // Simulate based on selected algorithm
      // Validate time quantum for Round Robin
    if (algorithm === 'Round Robin' && (timeQuantum < 1 || timeQuantum > 20)) {
      alert('Time quantum must be between 1 and 20');
      setIsSimulating(false);
      return;
    }
  let results;
  switch (algorithm) {
    case 'FCFS':
      results = SchedulingAlgorithm.FCFS(sortedProcesses);
      break;
    case 'SJF (Non-Preemptive)':
      results = SchedulingAlgorithm.SJF(sortedProcesses);
      break;
    case 'SJF (Preemptive)':
      results = SchedulingAlgorithm.SRTF(sortedProcesses);
      break;
    case 'Round Robin':
      results = SchedulingAlgorithm.RoundRobin(sortedProcesses, timeQuantum);
      break;
    case 'Priority':
      results = SchedulingAlgorithm.Priority(sortedProcesses);
      break;
    default:
      results = SchedulingAlgorithm.FCFS(sortedProcesses);
  }
    
    
    setTimeout(() => {
      setSimulationResults(results);
      setIsSimulating(false);
    }, 1500);
 };

  // Process Management Functions with Advanced Validation
  const addProcess = () => {
    if (processes.length >= 10) {
      alert('Maximum 10 processes allowed');
      return;
    }

    const newProcess = {
      id: processes.length + 1,
      arrivalTime: Math.max(0, ...processes.map(p => p.arrivalTime)),
      burstTime: Math.floor(Math.random() * 15) + 1,
      priority: Math.floor(Math.random() * 5) + 1
    };
    setProcesses([...processes, newProcess]);
  };

  const removeProcess = (id) => {
    if (processes.length <= 2) {
      alert('At least 2 processes are required');
      return;
    }
    setProcesses(processes.filter(p => p.id !== id));
  };

  // Advanced Logo with Animated Gradient
  
  const AdvancedLogo = () => {
    return (
      <svg viewBox="0 0 400 200" className="w-72 h-36">
        <defs>
          {/* Metallic gradient for CPU */}
          <linearGradient id="metallicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="50%" stopColor="#d4d4d4" />
            <stop offset="100%" stopColor="#b8b8b8" />
          </linearGradient>
  
          {/* Processor surface texture */}
          <pattern id="processorPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 2 2 h 56 v 56 h -56 z" fill="none" stroke="#999" strokeWidth="0.5" />
            <path d="M 10 2 v 56 M 20 2 v 56 M 30 2 v 56 M 40 2 v 56 M 50 2 v 56" 
                  stroke="#999" strokeWidth="0.2" />
            <path d="M 2 10 h 56 M 2 20 h 56 M 2 30 h 56 M 2 40 h 56 M 2 50 h 56" 
                  stroke="#999" strokeWidth="0.2" />
          </pattern>
  
          {/* Text effects */}
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B486B">
              <animate attributeName="stopColor" 
                values="#0B486B; #3494E6; #0B486B"
                dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#4A90E2">
              <animate attributeName="stopColor" 
                values="#4A90E2; #79CEDC; #4A90E2"
                dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
  
          {/* Neon glow for text */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feFlood result="flood" floodColor="#4a90e2" floodOpacity=".3"/>
            <feComposite in="flood" result="mask" in2="SourceGraphic" operator="in"/>
            <feGaussianBlur in="mask" result="blurred" stdDeviation="3"/>
            <feMerge>
              <feMergeNode in="blurred"/>
              <feMergeNode in="blurred"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
  
          {/* Circuit pattern for text background */}
          <pattern id="textCircuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 5 10 h 10 M 10 5 v 10" stroke="#4a90e2" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="10" cy="10" r="1" fill="#4a90e2" opacity="0.3"/>
          </pattern>
  
          {/* Text texture */}
          <pattern id="textTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 4 4 M 4 0 L 0 4" stroke="#fff" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
  
        {/* Main CPU Component */}
        <g transform="translate(40, 60)">
          {/* CPU Base */}
          <rect x="0" y="0" width="80" height="80" rx="5" 
                fill="url(#metallicGradient)" 
                stroke="#999" 
                strokeWidth="1.5" />
          
          {/* Processor Surface */}
          <rect x="5" y="5" width="70" height="70" 
                fill="url(#processorPattern)" />
  
          {/* CPU Pins */}
          {[...Array(8)].map((_, i) => (
            <g key={`pins-${i}`}>
              <rect x={10 + i * 9} y="-5" width="2" height="5" fill="#888" />
              <rect x={10 + i * 9} y="80" width="2" height="5" fill="#888" />
              <rect x="-5" y={10 + i * 9} width="5" height="2" fill="#888" />
              <rect x="80" y={10 + i * 9} width="5" height="2" fill="#888" />
            </g>
          ))}
  
          {/* Processing Core */}
          <circle cx="40" cy="40" r="15" fill="url(#textGradient)" fillOpacity="0.7">
            <animate attributeName="r"
                     values="15;17;15"
                     dur="2s"
                     repeatCount="indefinite"/>
          </circle>
        </g>
  
        {/* Advanced Text Treatment */}
        <g transform="translate(140, 105)">
          {/* Text Background Elements */}
          <rect x="0" y="-40" width="220" height="60" fill="url(#textCircuit)" opacity="0.1"/>
          
          {/* Main Text with Effects */}
          <text className="font-mono" fontSize="48" fontWeight="900">
            {/* Decorative underline */}
            <path d="M 0 10 H 200" stroke="url(#textGradient)" strokeWidth="2" strokeDasharray="1 2">
              <animate attributeName="strokeDashoffset"
                       values="3;0"
                       dur="1s"
                       repeatCount="indefinite"/>
            </path>
            
            {/* CPU Text */}
            <tspan x="0" fill="url(#textGradient)" filter="url(#neonGlow)">CPU</tspan>
            
            {/* Sim Text with different effect */}
            <tspan x="90" fill="url(#textGradient)" filter="url(#neonGlow)">
              Sim
              <animate attributeName="fillOpacity"
                       values="0.8;1;0.8"
                       dur="2s"
                       repeatCount="indefinite"/>
            </tspan>
          </text>
  
          {/* Animated Tech Accents */}
          <g stroke="url(#textGradient)" strokeWidth="0.5">
            <path d="M 0 -20 L 220 -20" strokeDasharray="2 2">
              <animate attributeName="strokeDashoffset"
                       values="4;0"
                       dur="1s"
                       repeatCount="indefinite"/>
            </path>
            <path d="M 0 20 L 220 20" strokeDasharray="2 2">
              <animate attributeName="strokeDashoffset"
                       values="4;0"
                       dur="1s"
                       repeatCount="indefinite"/>
            </path>
          </g>
        </g>
  
        {/* Circuit Traces */}
        <g transform="translate(320, 70)" stroke="url(#textGradient)" strokeWidth="0.75" fill="none">
          {[...Array(3)].map((_, i) => (
            <path key={`circuit-${i}`}
                  d={`M 0 ${i * 20} Q 20 ${i * 20}, 20 ${i * 20 + 10} T 40 ${i * 20 + 20}`}
                  strokeDasharray="4 2">
              <animate attributeName="strokeDashoffset"
                       values="6;0"
                       dur={`${1 + i * 0.2}s`}
                       repeatCount="indefinite"/>
            </path>
          ))}
        </g>
      </svg>
    );
  };
  
  return (
    <AdvancedCPUBackground>
    <div className="min-h-screen p-6">
      <div className="container mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6">
        {/* Advanced Header */}
        <header className="flex justify-between items-center mb-8">
          <AdvancedLogo />
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setAdvancedMode(false)}
                className={`px-4 py-2 rounded-full transition ${!advancedMode ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                Basic
              </button>
              <button 
                onClick={() => setAdvancedMode(true)}
                className={`px-4 py-2 rounded-full transition ${advancedMode ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              >
                Advanced
              </button>
            </div>
            <select 
              value={algorithm} 
              onChange={(e) => {
                setAlgorithm(e.target.value);
                if (e.target.value === 'Round Robin') {
                  setTimeQuantum(2); // Reset to default when selecting Round Robin
                }
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {['FCFS', 'SJF (Non-Preemptive)', 'SJF (Preemptive)', 'Round Robin', 'Priority'].map(algo => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
             {/* Add Time Quantum Input for Round Robin */}
             {showTimeQuantum && (
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Time Quantum:</label>
                <input
                  type="number"
                  value={timeQuantum}
                  onChange={(e) => setTimeQuantum(Math.max(1, Math.min(20, Number(e.target.value))))}
                  className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="20"
                />
              </div>
            )}
          </div>
        </header>

        {/* Update the table structure */}
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-50 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Process ID</th>
                <th className="p-3 text-left">Arrival Time</th>
                <th className="p-3 text-left">Burst Time</th>
                {showPriority && <th className="p-3 text-left">Priority</th>}
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3">{process.id}</td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={process.arrivalTime} 
                      onChange={(e) => {
                        const updatedProcesses = processes.map(p => 
                          p.id === process.id 
                            ? {...p, arrivalTime: Math.max(0, Number(e.target.value))} 
                            : p
                        );
                        setProcesses(updatedProcesses);
                      }}
                      className="w-20 p-1 border rounded"
                      min="0"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={process.burstTime} 
                      onChange={(e) => {
                        const updatedProcesses = processes.map(p => 
                          p.id === process.id 
                            ? {...p, burstTime: Math.max(1, Number(e.target.value))} 
                            : p
                        );
                        setProcesses(updatedProcesses);
                      }}
                      className="w-20 p-1 border rounded"
                      min="1"
                    />
                  </td>
                  {showPriority && (
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={process.priority} 
                        onChange={(e) => {
                          const updatedProcesses = processes.map(p => 
                            p.id === process.id 
                              ? {...p, priority: Math.max(1, Number(e.target.value))} 
                              : p
                          );
                          setProcesses(updatedProcesses);
                        }}
                        className="w-20 p-1 border rounded"
                        min="1"
                      />
                    </td>
                  )}
                  <td className="p-3">
                    <button 
                      onClick={() => removeProcess(process.id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded"
                    >
                      <Minus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Advanced Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-4">
            <button 
              onClick={addProcess}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Plus size={20} /> Add Process
            </button>
            {advancedMode && (
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  <Save size={20} />
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  <FileText size={20} />
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={simulateScheduling}
            disabled={isSimulating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isSimulating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
            <Play size={20} />
          </button>
        </div>

        {/* Advanced Simulation Results */}
        {simulationResults && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow-inner mt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 /> Simulation Results
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Avg. Waiting Time', value: simulationResults.avgWaitingTime, color: 'blue' },
                  { label: 'Avg. Turnaround Time', value: simulationResults.avgTurnaroundTime, color: 'green' },
                  { label: 'Avg. Response Time', value: simulationResults.avgResponseTime, color: 'purple' }
                ].map(metric => (
                  <div key={metric.label} className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-gray-600">{metric.label}</h4>
                    <p className={`text-2xl font-bold text-${metric.color}-600`}>
                      {metric.value.toFixed(2)} ms
                    </p> 
                  </div>
                ))} 
              </div>
            </div>

            {/* Advanced Process Visualization */}
            <ProcessGanttChart 
              processes={processes} 
              simulationResults={simulationResults}
              algorithm={algorithm}
            />
          </div>
        )}
      </div>
    </div>
     </AdvancedCPUBackground>
  );
};
export default CPUSchedulerSimulator;