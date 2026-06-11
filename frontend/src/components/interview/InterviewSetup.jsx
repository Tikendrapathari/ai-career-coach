import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Code, Briefcase, Building2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const InterviewSetup = ({ onStart }) => {
  const [type, setType] = useState('technical');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const interviewTypes = [
    { id: 'hr', label: 'HR Interview', icon: <Mic className="w-5 h-5" />, color: 'indigo' },
    { id: 'technical', label: 'Technical Interview', icon: <Code className="w-5 h-5" />, color: 'purple' },
    { id: 'behavioral', label: 'Behavioral Interview', icon: <Briefcase className="w-5 h-5" />, color: 'blue' },
    { id: 'company', label: 'Company Specific', icon: <Building2 className="w-5 h-5" />, color: 'cyan' }
  ];

  const companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Accenture'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ type, company: type === 'company' ? company : null, role, difficulty });
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Interview Setup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-3">Interview Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interviewTypes.map((interviewType) => (
              <button
                key={interviewType.id}
                type="button"
                onClick={() => setType(interviewType.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  type === interviewType.id
                    ? `border-${interviewType.color}-500 bg-${interviewType.color}-500/20`
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {interviewType.icon}
                  <span className="text-white text-sm">{interviewType.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {type === 'company' && (
          <div>
            <label className="block text-white mb-2">Select Company</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Select a company</option>
              {companies.map((comp) => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-white mb-2">Job Role / Position</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Full Stack Developer, Data Scientist"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Difficulty Level</label>
          <div className="flex gap-3">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2 rounded-lg capitalize transition-all duration-300 ${
                  difficulty === level
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Start Interview
        </Button>
      </form>
    </Card>
  );
};

export default InterviewSetup;