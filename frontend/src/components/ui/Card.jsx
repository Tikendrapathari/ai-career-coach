import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, gradient = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`rounded-xl ${gradient ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-white/10'} backdrop-blur-lg border border-white/20 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;