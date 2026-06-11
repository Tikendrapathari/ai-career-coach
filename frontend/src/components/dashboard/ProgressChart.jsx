import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Award } from 'lucide-react';
import Card from '../ui/Card';

const ProgressChart = ({ 
  type = 'line', 
  data = [], 
  title = 'Progress Overview',
  height = 300,
  showLegend = true,
  showGrid = true
}) => {
  
  // Default data if none provided
  const defaultData = [
    { month: 'Jan', score: 65, interviews: 2, coding: 3 },
    { month: 'Feb', score: 72, interviews: 3, coding: 4 },
    { month: 'Mar', score: 78, interviews: 4, coding: 5 },
    { month: 'Apr', score: 82, interviews: 5, coding: 6 },
    { month: 'May', score: 85, interviews: 6, coding: 7 },
    { month: 'Jun', score: 88, interviews: 7, coding: 8 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Colors for charts
  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Line Chart Component
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />}
        <XAxis dataKey="month" stroke="#ffffff60" />
        <YAxis stroke="#ffffff60" />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend wrapperStyle={{ color: '#fff' }} />}
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#6366f1" 
          strokeWidth={3}
          dot={{ fill: '#6366f1', strokeWidth: 2 }}
          activeDot={{ r: 8 }}
          name="Performance Score"
        />
        <Line 
          type="monotone" 
          dataKey="coding" 
          stroke="#06b6d4" 
          strokeWidth={3}
          dot={{ fill: '#06b6d4', strokeWidth: 2 }}
          name="Coding Progress"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Bar Chart Component
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />}
        <XAxis dataKey="month" stroke="#ffffff60" />
        <YAxis stroke="#ffffff60" />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend wrapperStyle={{ color: '#fff' }} />}
        <Bar dataKey="score" fill="#6366f1" name="Interview Score" radius={[4, 4, 0, 0]} />
        <Bar dataKey="interviews" fill="#8b5cf6" name="Interviews Taken" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  // Area Chart Component
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />}
        <XAxis dataKey="month" stroke="#ffffff60" />
        <YAxis stroke="#ffffff60" />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend wrapperStyle={{ color: '#fff' }} />}
        <Area 
          type="monotone" 
          dataKey="score" 
          stackId="1"
          stroke="#6366f1" 
          fill="#6366f1" 
          fillOpacity={0.3}
          name="Performance Score"
        />
        <Area 
          type="monotone" 
          dataKey="coding" 
          stackId="1"
          stroke="#06b6d4" 
          fill="#06b6d4" 
          fillOpacity={0.3}
          name="Coding Progress"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Pie Chart Component
  const renderPieChart = () => {
    const pieData = [
      { name: 'Technical', value: 82, color: '#6366f1' },
      { name: 'Communication', value: 75, color: '#8b5cf6' },
      { name: 'Confidence', value: 88, color: '#06b6d4' },
      { name: 'Problem Solving', value: 79, color: '#10b981' }
    ];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#ffffff60', strokeWidth: 1 }}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend wrapperStyle={{ color: '#fff' }} />}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Radar Chart Component
  const renderRadarChart = () => {
    const radarData = [
      { subject: 'Resume', A: 85, fullMark: 100 },
      { subject: 'Communication', A: 78, fullMark: 100 },
      { subject: 'Technical', A: 82, fullMark: 100 },
      { subject: 'Coding', A: 75, fullMark: 100 },
      { subject: 'Confidence', A: 88, fullMark: 100 },
      { subject: 'Interview', A: 80, fullMark: 100 }
    ];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="#ffffff20" />
          <PolarAngleAxis dataKey="subject" stroke="#ffffff60" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff60" />
          <Radar 
            name="Your Score" 
            dataKey="A" 
            stroke="#6366f1" 
            fill="#6366f1" 
            fillOpacity={0.6} 
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend wrapperStyle={{ color: '#fff' }} />}
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  // Progress Ring Component
  const ProgressRing = ({ value, label, color }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#ffffff20"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <text x="100" y="110" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
            {value}%
          </text>
        </svg>
        <p className="text-white mt-2 font-semibold">{label}</p>
      </div>
    );
  };

  // Stats Cards Component
  const StatsCards = () => {
    const stats = [
      { label: 'Average Score', value: '82%', change: '+5%', trend: 'up', color: '#10b981' },
      { label: 'Interviews Taken', value: '24', change: '+3', trend: 'up', color: '#6366f1' },
      { label: 'Coding Problems', value: '156', change: '+12', trend: 'up', color: '#06b6d4' },
      { label: 'Resume Score', value: '85%', change: '+8%', trend: 'up', color: '#8b5cf6' }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 rounded-lg p-4"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {stat.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Get chart icon based on type
  const getChartIcon = () => {
    switch(type) {
      case 'line': return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      case 'bar': return <Activity className="w-5 h-5 text-purple-400" />;
      case 'area': return <Target className="w-5 h-5 text-cyan-400" />;
      case 'pie': return <Award className="w-5 h-5 text-green-400" />;
      case 'radar': return <Target className="w-5 h-5 text-orange-400" />;
      default: return <TrendingUp className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {getChartIcon()}
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        
        {/* Chart Type Selector (optional) */}
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              type === 'line' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Line
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              type === 'bar' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Bar
          </button>
          <button 
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              type === 'area' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Area
          </button>
        </div>
      </div>

      {/* Stats Cards (optional) */}
      {type === 'stats' && <StatsCards />}

      {/* Progress Rings */}
      {type === 'rings' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProgressRing value={85} label="Resume Score" color="#6366f1" />
          <ProgressRing value={78} label="Communication" color="#8b5cf6" />
          <ProgressRing value={82} label="Technical" color="#06b6d4" />
          <ProgressRing value={88} label="Confidence" color="#10b981" />
        </div>
      )}

      {/* Main Chart */}
      {type === 'line' && renderLineChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'area' && renderAreaChart()}
      {type === 'pie' && renderPieChart()}
      {type === 'radar' && renderRadarChart()}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center text-gray-400 text-xs">
          <span>Last updated: Today</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
              <span>Your Performance</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Target</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressChart;