import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Desktop pe always open
      } else {
        setIsOpen(false); // Mobile pe closed
      }
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg md:hidden"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-black/95 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col transition-transform duration-300 ease-out
          w-72
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${!isMobile ? 'md:relative md:translate-x-0 md:w-64' : ''}
        `}
      >
        {/* Close button */}
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="p-4 sm:p-6 pt-16 sm:pt-6">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-white font-bold text-base sm:text-xl">AI Career Coach</span>
          </div>
          
          <nav className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-300 ${
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
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* Spacer for desktop */}
      {!isMobile && <div className="w-64 flex-shrink-0" />}
    </>
  );
};

export default Sidebar;
