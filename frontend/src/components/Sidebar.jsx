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
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
    { path: '/resume-analyzer', icon: <FileText className="w-5 h-5" />, label: 'Resume Analyzer' },
    { path: '/mock-interview', icon: <Mic className="w-5 h-5" />, label: 'Mock Interview' },
    { path: '/coding-interview', icon: <Code className="w-5 h-5" />, label: 'Coding Interview' },
    { path: '/career-mentor', icon: <Bot className="w-5 h-5" />, label: 'Career Mentor' },
    { path: '/roadmap', icon: <Target className="w-5 h-5" />, label: 'Roadmap' },
    { path: '/job-matching', icon: <Briefcase className="w-5 h-5" />, label: 'Job Matching' },
    { path: '/company-prep', icon: <Building2 className="w-5 h-5" />, label: 'Company Prep' },
    { path: '/report', icon: <BarChart3 className="w-5 h-5" />, label: 'Reports' }
  ];

  return (
    <>
      {/* Sidebar - Always visible on all devices (no hamburger menu) */}
      <div className="w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 z-30 flex flex-col overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
            <span className="text-white font-bold text-base sm:text-xl">AI Career Coach</span>
          </div>
          
          <nav className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm sm:text-base">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 sm:p-6">
          <button
            onClick={logout}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 w-full"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Spacer for main content */}
      <div className="w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;
