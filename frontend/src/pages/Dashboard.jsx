import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Mic, 
  Code, 
  Bot, 
  Target, 
  TrendingUp,
  Award,
  ChevronRight,
  Activity,
  Clock,
  User,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    resumeScore: 0,
    completedRoadmaps: 0,
    codingSessions: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [progressData, setProgressData] = useState([
    { month: 'Jan', score: 0 },
    { month: 'Feb', score: 0 },
    { month: 'Mar', score: 0 },
    { month: 'Apr', score: 0 },
    { month: 'May', score: 0 },
    { month: 'Jun', score: 0 }
  ]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const interviewsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/interview/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const interviews = interviewsRes.data || [];
      
      const resumeRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/resume/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const resumes = resumeRes.data || [];
      const latestResume = resumes[0];
      
      const totalInterviews = interviews.length;
      const avgScore = interviews.length > 0 
        ? Math.round(interviews.reduce((acc, i) => acc + (i.scores?.overall || 0), 0) / interviews.length)
        : 0;
      
      setStats({
        totalInterviews,
        averageScore: avgScore,
        resumeScore: latestResume?.atsScore || user?.profile?.resumeScore || 0,
        completedRoadmaps: 0,
        codingSessions: user?.statistics?.codingSessions || 0
      });
      
      const activities = interviews.slice(0, 5).map((interview, idx) => ({
        id: idx,
        title: `${interview.type?.toUpperCase() || 'Mock'} Interview`,
        score: interview.scores?.overall || 0,
        date: formatDate(interview.completedAt),
        icon: <Mic className="w-4 h-4" />
      }));
      
      if (latestResume) {
        activities.push({
          id: activities.length,
          title: 'Resume Analyzed',
          score: latestResume.atsScore,
          date: formatDate(latestResume.createdAt),
          icon: <FileText className="w-4 h-4" />
        });
      }
      
      setRecentActivities(activities.slice(0, 5));
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  const skillData = [
    { name: 'Technical', value: stats.averageScore || 70, color: '#6366f1' },
    { name: 'Communication', value: stats.averageScore ? Math.min(100, stats.averageScore + 5) : 65, color: '#8b5cf6' },
    { name: 'Confidence', value: stats.averageScore ? Math.min(100, stats.averageScore - 3) : 68, color: '#06b6d4' },
    { name: 'Problem Solving', value: stats.codingSessions > 0 ? Math.min(100, 60 + stats.codingSessions) : 60, color: '#10b981' }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile padding for menu button */}
        <div className="pt-14 lg:pt-0">
          <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
            
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 sm:mb-8"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  Welcome back, {user?.name || 'User'}! 👋
                </h1>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm">
                Your career journey is progressing well!
              </p>
            </motion.div>
            
            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white/80 text-xs">Total Interviews</p>
                    <p className="text-2xl font-bold text-white">{stats.totalInterviews}</p>
                  </div>
                  <Mic className="w-6 h-6 text-white/80" />
                </div>
                <p className="text-white/70 text-xs">{stats.totalInterviews} completed</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white/80 text-xs">Average Score</p>
                    <p className="text-2xl font-bold text-white">{stats.averageScore}%</p>
                  </div>
                  <Award className="w-6 h-6 text-white/80" />
                </div>
                <p className="text-white/70 text-xs">All interviews</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white/80 text-xs">Resume Score</p>
                    <p className="text-2xl font-bold text-white">{stats.resumeScore}%</p>
                  </div>
                  <FileText className="w-6 h-6 text-white/80" />
                </div>
                <p className="text-white/70 text-xs">{stats.resumeScore >= 70 ? 'Good' : 'Needs improvement'}</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white/80 text-xs">Coding</p>
                    <p className="text-2xl font-bold text-white">{stats.codingSessions}</p>
                  </div>
                  <Code className="w-6 h-6 text-white/80" />
                </div>
                <p className="text-white/70 text-xs">Problems solved</p>
              </div>
            </div>
            
            {/* Charts Row - Responsive */}
            <div className="grid lg:grid-cols-2 gap-5 mb-6 sm:mb-8">
              {/* Progress Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Performance Progress
                </h3>
                {stats.totalInterviews === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <p>No data yet</p>
                    <p className="text-xs mt-1">Take a mock interview!</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="month" stroke="#ffffff60" fontSize={10} />
                      <YAxis domain={[0, 100]} stroke="#ffffff60" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              {/* Skills Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-purple-400" />
                  Skills Distribution
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={skillData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#ffffff60', strokeWidth: 1 }}
                    >
                      {skillData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 mt-3 flex-wrap">
                  {skillData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-300 text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
              {[
                { title: 'Resume', icon: <FileText className="w-4 h-4" />, color: 'bg-indigo-500', path: '/resume-analyzer' },
                { title: 'Interview', icon: <Mic className="w-4 h-4" />, color: 'bg-purple-500', path: '/mock-interview' },
                { title: 'Coding', icon: <Code className="w-4 h-4" />, color: 'bg-blue-500', path: '/coding-interview' },
                { title: 'Mentor', icon: <Bot className="w-4 h-4" />, color: 'bg-cyan-500', path: '/career-mentor' }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = action.path}
                  className={`${action.color} rounded-xl p-2 sm:p-3 text-white text-center hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    {action.icon}
                    <span className="font-semibold text-[10px] sm:text-xs">{action.title}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-indigo-400" />
                Recent Activity
              </h3>
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  <p>No recent activities</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                          {activity.icon}
                        </div>
                        <div>
                          <p className="text-white text-sm">{activity.title}</p>
                          <p className="text-gray-400 text-xs">{activity.date}</p>
                        </div>
                      </div>
                      {activity.score > 0 && (
                        <span className={`text-xs font-semibold ${activity.score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {activity.score}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
