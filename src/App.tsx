import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { Activity, Settings2, BookOpen, Zap } from 'lucide-react';
import { defaultParams, simulateHH, HHParams } from './lib/hh-model';
import { Slider } from './components/Slider';
import { FormulaDisplay } from './components/FormulaDisplay';

export default function App() {
  const [params, setParams] = useState<HHParams>(defaultParams);
  const [activeTab, setActiveTab] = useState<'simulation' | 'formulas'>('simulation');

  const data = useMemo(() => simulateHH(params), [params]);

  const handleParamChange = (key: keyof HHParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Hodgkin-Huxley Model
              </h1>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Computational Neuroscience
              </p>
            </div>
          </div>
          <nav className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'simulation'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              Simulation
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'formulas'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Formulas
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulation' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-800">Stimulus</h2>
                </div>
                <Slider
                  label="Current (I_ext)"
                  value={params.I_ext}
                  min={0}
                  max={50}
                  step={0.5}
                  unit="µA/cm²"
                  onChange={(v) => handleParamChange('I_ext', v)}
                />
                <Slider
                  label="Start Time"
                  value={params.I_start}
                  min={0}
                  max={params.duration}
                  step={1}
                  unit="ms"
                  onChange={(v) => handleParamChange('I_start', v)}
                />
                <Slider
                  label="End Time"
                  value={params.I_end}
                  min={params.I_start}
                  max={params.duration}
                  step={1}
                  unit="ms"
                  onChange={(v) => handleParamChange('I_end', v)}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">
                  Membrane Parameters
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Conductances
                    </h3>
                    <Slider
                      label="g_Na (Sodium)"
                      value={params.g_Na}
                      min={0}
                      max={200}
                      step={1}
                      unit="mS/cm²"
                      onChange={(v) => handleParamChange('g_Na', v)}
                    />
                    <Slider
                      label="g_K (Potassium)"
                      value={params.g_K}
                      min={0}
                      max={100}
                      step={1}
                      unit="mS/cm²"
                      onChange={(v) => handleParamChange('g_K', v)}
                    />
                    <Slider
                      label="g_L (Leak)"
                      value={params.g_L}
                      min={0}
                      max={2}
                      step={0.1}
                      unit="mS/cm²"
                      onChange={(v) => handleParamChange('g_L', v)}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Reversal Potentials
                    </h3>
                    <Slider
                      label="E_Na"
                      value={params.E_Na}
                      min={0}
                      max={100}
                      step={1}
                      unit="mV"
                      onChange={(v) => handleParamChange('E_Na', v)}
                    />
                    <Slider
                      label="E_K"
                      value={params.E_K}
                      min={-100}
                      max={0}
                      step={1}
                      unit="mV"
                      onChange={(v) => handleParamChange('E_K', v)}
                    />
                    <Slider
                      label="E_L"
                      value={params.E_L}
                      min={-100}
                      max={0}
                      step={0.1}
                      unit="mV"
                      onChange={(v) => handleParamChange('E_L', v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Area */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Voltage Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Membrane Potential (V_m)
                </h2>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="t"
                        type="number"
                        domain={[0, params.duration]}
                        tickFormatter={(v) => `${v}ms`}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[-100, 60]}
                        tickFormatter={(v) => `${v}mV`}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickMargin={10}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(v) => `Time: ${v} ms`}
                        formatter={(value: number) => [`${value.toFixed(2)} mV`, 'Voltage']}
                      />
                      <ReferenceArea
                        x1={params.I_start}
                        x2={params.I_end}
                        fill="#fef3c7"
                        fillOpacity={0.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="V"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Gating Variables Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[300px] flex flex-col">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Gating Variables
                  </h2>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="t" type="number" domain={[0, params.duration]} hide />
                        <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={12} tickMargin={10} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelFormatter={(v) => `Time: ${v} ms`}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <ReferenceArea x1={params.I_start} x2={params.I_end} fill="#fef3c7" fillOpacity={0.3} />
                        <Line type="monotone" dataKey="m" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} name="m (Na act)" />
                        <Line type="monotone" dataKey="h" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} name="h (Na inact)" />
                        <Line type="monotone" dataKey="n" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name="n (K act)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Currents Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[300px] flex flex-col">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Ionic Currents
                  </h2>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="t" type="number" domain={[0, params.duration]} hide />
                        <YAxis stroke="#94a3b8" fontSize={12} tickMargin={10} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelFormatter={(v) => `Time: ${v} ms`}
                          formatter={(value: number, name: string) => [`${value.toFixed(2)} µA/cm²`, name]}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        <ReferenceArea x1={params.I_start} x2={params.I_end} fill="#fef3c7" fillOpacity={0.3} />
                        <Line type="monotone" dataKey="I_Na" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} name="I_Na" />
                        <Line type="monotone" dataKey="I_K" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name="I_K" />
                        <Line type="monotone" dataKey="I_L" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} name="I_L" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <FormulaDisplay />
          </div>
        )}
      </main>
    </div>
  );
}
