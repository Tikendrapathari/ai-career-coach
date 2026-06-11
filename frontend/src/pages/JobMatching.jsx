import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Briefcase, MapPin, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobMatching = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobs/recommendations`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setRecommendations(response.data);
    } catch (error) {
      toast.error('Failed to fetch job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
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
            <h1 className="text-3xl font-bold text-white mb-2">Job Matching System</h1>
            <p className="text-gray-300">
              AI-powered job recommendations based on your skills and experience
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Analyzing your profile...</p>
            </div>
          ) : recommendations ? (
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Recommended Jobs</h2>
                <div className="space-y-4">
                  {recommendations.recommendedJobs?.map((job, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <p className="text-indigo-400">{job.company}</p>
                        </div>
                        <div className={`text-2xl font-bold ${getMatchColor(job.matchScore)}`}>
                          {job.matchScore}%
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-3 text-sm">
                        {job.salary && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-400">
                          <TrendingUp className="w-4 h-4" />
                          Match Score: {job.matchScore}%
                        </span>
                      </div>
                      
                      {job.missingSkills && job.missingSkills.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg">
                          <p className="text-yellow-400 text-sm mb-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Missing Skills to Improve:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.applicationUrl && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-3"
                          onClick={() => window.open(job.applicationUrl, '_blank')}
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
              
              {recommendations.skillGap && recommendations.skillGap.length > 0 && (
                <Card>
                  <h2 className="text-2xl font-bold text-white mb-6">Skill Gap Analysis</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations.skillGap.map((skill, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg">
                        <h3 className="text-indigo-400 font-semibold mb-2">{skill.skill}</h3>
                        <p className="text-gray-400 text-sm mb-2">Importance: {skill.importance}</p>
                        <div className="space-y-1">
                          {skill.resources?.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 text-sm hover:underline block"
                            >
                              • Learning Resource {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No recommendations yet</h3>
              <p className="text-gray-400 mb-6">
                Complete your profile and upload your resume to get personalized job matches
              </p>
              <Button onClick={fetchRecommendations}>Refresh Recommendations</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatching;