import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Mic, 
  Code, 
  Bot, 
  Target, 
  Briefcase,
  Building2,
  BarChart3,
  LogOut,
  Sparkles,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  
  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { path: '/profile', icon: <User />, label: 'Profile' },
    { path: '/resume-analyzer', icon: <FileText />, label: 'Resume Analyzer' },
    { path: '/mock-interview', icon: <Mic />, label: 'Mock Interview' },
    { path: '/coding-interview', icon: <Code />, label: 'Coding Interview' },
    { path: '/career-mentor', icon: <Bot />, label: 'Career Mentor' },
    { path: '/roadmap', icon: <Target />, label: 'Roadmap' },
    { path: '/job-matching', icon: <Briefcase />, label: 'Job Matching' },
    { path: '/company-prep', icon: <Building2 />, label: 'Company Prep' },
    { path: '/report', icon: <BarChart3 />, label: 'Reports' }
  ];

  return (
    <div className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-indigo-400" />
          <span className="text-white font-bold text-xl">AI Career Coach</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;