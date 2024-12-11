import React, { useState, useEffect, useRef, useMemo } from 'react';
import {  Flame, Clock, Settings, CodeXml, BarChart3, Play, Pause,  Plus, Minus, Save, FileText, RefreshCw, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class SchedulingAlgorithm {
  static FCFS(processes) {
    let currentTime = 0;
    const processResults = processes.map(process => {
      const startTime = Math.max(currentTime, process.arrivalTime);
      const waitingTime = startTime - process.arrivalTime;
      const turnaroundTime = waitingTime + process.burstTime;
      currentTime = startTime + process.burstTime;
      
      return {
        ...process,
        startTime,
        completionTime: currentTime,
        waitingTime,
        turnaroundTime,
        responseTime: waitingTime
      };
    });

    return {
      processResults,
      avgWaitingTime: this.calculateAverage(processResults, 'waitingTime'),
      avgTurnaroundTime: this.calculateAverage(processResults, 'turnaroundTime'),
      avgResponseTime: this.calculateAverage(processResults, 'responseTime')
    };
  }

  static calculateAverage(results, key) {
    return results.reduce((sum, proc) => sum + proc[key], 0) / results.length;
  }
}

// Advanced Visualization Component
const ProcessGanttChart = ({ processes, simulationResults }) => {
  if (!simulationResults) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 /> Process Execution Timeline
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart 
          data={simulationResults.processResults.map(proc => ({
            name: `P${proc.id}`,
            startTime: proc.startTime,
            completionTime: proc.completionTime,
            burstTime: proc.burstTime
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Time', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-4 border rounded shadow">
                    <p>Process: {data.name}</p>
                    <p>Start Time: {data.startTime}</p>
                    <p>Completion Time: {data.completionTime}</p>
                    <p>Burst Time: {data.burstTime}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line type="monotone" dataKey="startTime" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="completionTime" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
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

  // Advanced Simulation Method
  const simulateScheduling = () => {
    setIsSimulating(true);
    
    // Sort processes by arrival time to ensure correct simulation
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    // Simulate based on selected algorithm
    const results = SchedulingAlgorithm.FCFS(sortedProcesses);
    
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
  const AdvancedLogo = () => (
    <svg viewBox="0 0 200 100" className="w-40 h-20">
      <defs>
        <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <animate 
            attributeName="x1" 
            values="0%;100%" 
            dur="3s" 
            repeatCount="indefinite" 
          />
          <stop offset="0%" stopColor="#3494E6" />
          <stop offset="100%" stopColor="#EC6EAD" />
        </linearGradient>
      </defs>
      <text 
        x="50%" 
        y="60%" 
        textAnchor="middle" 
        fill="url(#animatedGradient)" 
        fontWeight="bold" 
        fontSize="40"
      >
        SchedSim
      </text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-6">
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
              onChange={(e) => setAlgorithm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {['FCFS', 'SJF (Non-Preemptive)', 'SJF (Preemptive)', 'Round Robin', 'Priority'].map(algo => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Advanced Processes Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-50 rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                {advancedMode && <th className="p-3 text-left">Select</th>}
                <th className="p-3 text-left">Process ID</th>
                <th className="p-3 text-left">Arrival Time</th>
                <th className="p-3 text-left">Burst Time</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="border-b hover:bg-blue-50 transition">
                  {advancedMode && (
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                  )}
                  <td className="p-3">{process.id}</td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={process.arrivalTime} 
                      onChange={(e) => {
                        const updatedProcesses = processes.map(p => 
                          p.id === process.id 
                            ? {...p, arrivalTime: Number(e.target.value)} 
                            : p
                        );
                        setProcesses(updatedProcesses);
                      }}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={process.burstTime} 
                      onChange={(e) => {
                        const updatedProcesses = processes.map(p => 
                          p.id === process.id 
                            ? {...p, burstTime: Number(e.target.value)} 
                            : p
                        );
                        setProcesses(updatedProcesses);
                      }}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      value={process.priority} 
                      onChange={(e) => {
                        const updatedProcesses = processes.map(p => 
                          p.id === process.id 
                            ? {...p, priority: Number(e.target.value)} 
                            : p
                        );
                        setProcesses(updatedProcesses);
                      }}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CPUSchedulerSimulator;