import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Mic, 
  Code, 
  Bot, 
  Target, 
  Briefcase,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Activity,
  Clock,
  User,
  Star,
  BookOpen
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user's interviews
      const interviewsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/interview/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const interviews = interviewsRes.data || [];
      
      // Fetch user's resume
      const resumeRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/resume/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const resumes = resumeRes.data || [];
      const latestResume = resumes[0];
      
      // Fetch user's roadmaps
      const roadmapRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/roadmap/my-roadmap`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).catch(() => ({ data: null }));
      const roadmap = roadmapRes.data;
      
      // Calculate statistics
      const totalInterviews = interviews.length;
      const avgScore = interviews.length > 0 
        ? Math.round(interviews.reduce((acc, i) => acc + (i.scores?.overall || 0), 0) / interviews.length)
        : 0;
      
      const resumeScore = latestResume?.atsScore || user?.profile?.resumeScore || 0;
      const completedRoadmaps = roadmap?.progress?.overallProgress === 100 ? 1 : 0;
      
      setStats({
        totalInterviews,
        averageScore: avgScore,
        resumeScore,
        completedRoadmaps,
        codingSessions: user?.statistics?.codingSessions || 0
      });
      
      setResume(latestResume);
      
      // Prepare progress data (last 6 months)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyScores = [];
      for (let i = 0; i < 6; i++) {
        const monthInterviews = interviews.filter(interview => {
          if (!interview.completedAt) return false;
          const interviewDate = new Date(interview.completedAt);
          const currentMonth = new Date().getMonth();
          const targetMonth = currentMonth - (5 - i);
          return interviewDate.getMonth() === targetMonth;
        });
        const monthAvg = monthInterviews.length > 0 
          ? Math.round(monthInterviews.reduce((acc, i) => acc + (i.scores?.overall || 0), 0) / monthInterviews.length)
          : 0;
        monthlyScores.push({ month: monthNames[i], score: monthAvg });
      }
      setProgressData(monthlyScores);
      
      // Prepare recent activities
      const activities = [];
      
      // Add interview activities
      interviews.slice(0, 5).forEach((interview, idx) => {
        activities.push({
          id: idx,
          type: 'interview',
          title: `${interview.type?.toUpperCase() || 'Mock'} Interview Completed`,
          score: interview.scores?.overall || 0,
          date: formatDate(interview.completedAt),
          icon: <Mic className="w-5 h-5" />
        });
      });
      
      // Add resume activity
      if (latestResume) {
        activities.push({
          id: activities.length,
          type: 'resume',
          title: 'Resume Analysis Updated',
          score: latestResume.atsScore,
          date: formatDate(latestResume.createdAt),
          icon: <FileText className="w-5 h-5" />
        });
      }
      
      // Add roadmap activity
      if (roadmap) {
        activities.push({
          id: activities.length,
          type: 'roadmap',
          title: `${roadmap.dreamJob || 'Career'} Roadmap Generated`,
          score: roadmap.progress?.overallProgress || 0,
          date: formatDate(roadmap.createdAt),
          icon: <Target className="w-5 h-5" />
        });
      }
      
      setRecentActivities(activities.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values from user object if API fails
      setStats({
        totalInterviews: user?.statistics?.totalInterviews || 0,
        averageScore: user?.statistics?.averageScore || 0,
        resumeScore: user?.profile?.resumeScore || 0,
        completedRoadmaps: user?.statistics?.completedRoadmaps || 0,
        codingSessions: user?.statistics?.codingSessions || 0
      });
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

  // Calculate skill data based on actual performance
  const skillData = [
    { name: 'Technical', value: stats.averageScore || 70, color: '#6366f1' },
    { name: 'Communication', value: stats.averageScore ? Math.min(100, stats.averageScore + 5) : 65, color: '#8b5cf6' },
    { name: 'Confidence', value: stats.averageScore ? Math.min(100, stats.averageScore - 3) : 68, color: '#06b6d4' },
    { name: 'Problem Solving', value: stats.codingSessions > 0 ? Math.min(100, 60 + stats.codingSessions) : 60, color: '#10b981' }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
            </div>
            <p className="text-gray-300">
              Your career journey is progressing well. Keep up the momentum!
            </p>
          </motion.div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Interviews', value: stats.totalInterviews, icon: <Mic className="w-8 h-8 text-indigo-400" />, change: `${stats.totalInterviews} total completed`, color: 'from-indigo-500 to-indigo-600' },
              { title: 'Average Score', value: `${stats.averageScore}%`, icon: <Award className="w-8 h-8 text-purple-400" />, change: 'Based on all interviews', color: 'from-purple-500 to-purple-600' },
              { title: 'Resume Score', value: `${stats.resumeScore}%`, icon: <FileText className="w-8 h-8 text-blue-400" />, change: stats.resumeScore >= 80 ? 'ATS friendly ✓' : 'Needs improvement', color: 'from-blue-500 to-blue-600' },
              { title: 'Roadmaps', value: stats.completedRoadmaps, icon: <Target className="w-8 h-8 text-cyan-400" />, change: `${stats.completedRoadmaps} completed`, color: 'from-cyan-500 to-cyan-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/80 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
                <p className="text-white/70 text-sm">{stat.change}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Performance Progress
              </h3>
              {stats.totalInterviews === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No interview data yet.</p>
                  <p className="text-sm mt-2">Take a mock interview to see your progress!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#ffffff60" />
                    <YAxis domain={[0, 100]} stroke="#ffffff60" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </motion.div>
            
            {/* Skills Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Skills Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#ffffff60', strokeWidth: 1 }}
                  >
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {skillData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300 text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: 'Resume Analysis', icon: <FileText />, color: 'bg-indigo-500', path: '/resume-analyzer' },
              { title: 'Mock Interview', icon: <Mic />, color: 'bg-purple-500', path: '/mock-interview' },
              { title: 'Coding Practice', icon: <Code />, color: 'bg-blue-500', path: '/coding-interview' },
              { title: 'Career Mentor', icon: <Bot />, color: 'bg-cyan-500', path: '/career-mentor' }
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.location.href = action.path}
                className={`${action.color} rounded-xl p-4 text-white text-center hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex flex-col items-center gap-2">
                  {action.icon}
                  <span className="font-semibold text-sm">{action.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h3>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No recent activities.</p>
                <p className="text-sm mt-2">Complete a mock interview or upload a resume to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.title}</p>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    {activity.score > 0 && (
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${activity.score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                          Score: {activity.score}%
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;