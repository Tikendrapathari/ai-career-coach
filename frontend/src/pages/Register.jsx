import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!password) {
      toast.error('Please enter a password');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await register(name, email, password);
      if (success) {
        toast.success('Registration successful! Welcome to AI Career Coach 🎉');
        navigate('/dashboard');
      } else {
        // Error message already shown by register function
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 w-full max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-300 text-sm sm:text-base">Start your AI-powered career journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white text-sm sm:text-base mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm sm:text-base mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm sm:text-base mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Create a password (min 6 characters)"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1">Password must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-white text-sm sm:text-base mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-gray-300 text-sm sm:text-base">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
