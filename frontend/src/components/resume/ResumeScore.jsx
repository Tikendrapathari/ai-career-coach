import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Target, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';

const ResumeScore = ({ score, strengths, weaknesses }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your resume is ATS-friendly';
    if (score >= 60) return 'Good! Some improvements needed';
    return 'Needs improvement. Follow our suggestions';
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Resume Analysis Results</h2>
      
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-48 h-48 mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ffffff20"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</div>
              <div className="text-gray-400 text-sm">ATS Score</div>
            </div>
          </div>
        </div>
        
        <p className="text-white text-center text-lg">{getScoreMessage(score)}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {strengths?.map((strength, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-2">
                <span className="text-green-400">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {weaknesses?.map((weakness, index) => (
              <li key={index} className="text-gray-300 flex items-start gap-2">
                <span className="text-yellow-400">!</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ResumeScore;