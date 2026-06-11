import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  onClick, 
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg',
    secondary: 'bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    outline: 'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;