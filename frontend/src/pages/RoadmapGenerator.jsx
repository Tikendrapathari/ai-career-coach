import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Target, Calendar, CheckCircle, BookOpen, Award, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RoadmapGenerator = () => {
  const [dreamJob, setDreamJob] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [timeline, setTimeline] = useState('6 months');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/roadmap/generate`,
        {
          dreamJob,
          currentSkills: currentSkills.split(',').map(s => s.trim()),
          timeline
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setRoadmap(response.data);
      toast.success('Roadmap generated successfully!');
    } catch (error) {
      toast.error('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Personalized Roadmap Generator</h1>
            <p className="text-gray-300">
              Get a customized learning path to achieve your dream career
            </p>
          </motion.div>

          {!roadmap ? (
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">Tell us about your goals</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Dream Job / Role *</label>
                  <input
                    type="text"
                    value={dreamJob}
                    onChange={(e) => setDreamJob(e.target.value)}
                    placeholder="e.g., Senior Full Stack Developer, Data Scientist"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Current Skills (comma-separated)</label>
                  <textarea
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    placeholder="e.g., JavaScript, React, Python, Node.js"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Timeline</label>
                  <div className="flex gap-3">
                    {['3 months', '6 months', '1 year'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setTimeline(option)}
                        className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
                          timeline === option
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={generateRoadmap} isLoading={loading} variant="primary" size="lg" className="w-full">
                  Generate My Roadmap
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Learning Path to {dreamJob}</h2>
                    <p className="text-gray-300 mt-1">{timeline} plan</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-400">{roadmap.progress?.overallProgress || 0}%</div>
                    <p className="text-gray-400 text-sm">Overall Progress</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                      Weekly Plan
                    </h3>
                    <div className="grid gap-4">
                      {roadmap.roadmap?.weekly?.map((week, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-indigo-400 font-semibold">Week {week.week}</h4>
                            {roadmap.progress?.completedWeeks?.includes(week.week) && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                          <ul className="space-y-2">
                            {week.topics?.map((topic, idx) => (
                              <li key={idx} className="text-gray-300 flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400 mt-1" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      Monthly Goals
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {roadmap.roadmap?.monthly?.map((month, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg">
                          <h4 className="text-purple-400 font-semibold mb-2">Month {month.month}</h4>
                          <p className="text-gray-300 text-sm mb-2">Focus: {month.focus}</p>
                          <ul className="text-gray-400 text-sm space-y-1">
                            {month.goals?.map((goal, idx) => (
                              <li key={idx}>• {goal}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerator;