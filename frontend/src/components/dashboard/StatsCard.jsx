import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, change, color = 'indigo' }) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl p-6 shadow-lg`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="text-white/80">{icon}</div>
      </div>
      {change && <p className="text-white/70 text-sm">{change}</p>}
    </motion.div>
  );
};

export default StatsCard;