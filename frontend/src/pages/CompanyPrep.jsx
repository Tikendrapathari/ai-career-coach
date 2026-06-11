import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Building2, FileText, Mic, Target, ChevronRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const companiesList = [
  { name: 'Google', color: 'from-blue-500 to-blue-600', icon: 'G' },
  { name: 'Microsoft', color: 'from-green-500 to-green-600', icon: 'M' },
  { name: 'Amazon', color: 'from-yellow-500 to-yellow-600', icon: 'A' },
  { name: 'Infosys', color: 'from-red-500 to-red-600', icon: 'I' },
  { name: 'TCS', color: 'from-indigo-500 to-indigo-600', icon: 'T' },
  { name: 'Wipro', color: 'from-purple-500 to-purple-600', icon: 'W' },
  { name: 'Accenture', color: 'from-cyan-500 to-cyan-600', icon: 'Ac' }
];

const CompanyPrep = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(company || null);
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      fetchPrepData();
    }
  }, [selectedCompany]);

  const fetchPrepData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interview/company-questions`,
        { company: selectedCompany },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPrepData(response.data);
    } catch (error) {
      toast.error('Failed to fetch preparation data');
    } finally {
      setLoading(false);
    }
  };

  const startMockInterview = () => {
    navigate('/mock-interview', { state: { type: 'company', company: selectedCompany } });
  };

  if (!selectedCompany) {
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
              <h1 className="text-3xl font-bold text-white mb-2">Company Specific Preparation</h1>
              <p className="text-gray-300">
                Choose a company to get tailored interview preparation material
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companiesList.map((comp) => (
                <motion.div
                  key={comp.name}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${comp.color} rounded-xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
                  onClick={() => setSelectedCompany(comp.name)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                      {comp.icon}
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/80" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{comp.name}</h2>
                  <p className="text-white/80 text-sm">
                    Interview preparation material and practice questions
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => setSelectedCompany(null)}
              className="text-indigo-400 hover:text-indigo-300 mb-4 flex items-center gap-2"
            >
              ← Back to Companies
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedCompany} Interview Preparation</h1>
            <p className="text-gray-300">
              Comprehensive preparation guide for {selectedCompany} interviews
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading preparation material...</p>
            </div>
          ) : prepData ? (
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Common Interview Questions
                </h2>
                <div className="space-y-3">
                  {prepData.questions?.map((question, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <p className="text-white font-medium">{index + 1}. {question}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Preparation Tips
                </h2>
                <ul className="space-y-2">
                  {prepData.tips?.map((tip, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>

              <Button onClick={startMockInterview} variant="primary" size="lg" className="w-full">
                <Mic className="w-5 h-5 mr-2" />
                Start Mock Interview
              </Button>
            </div>
          ) : (
            <Card className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No data available</h3>
              <Button onClick={fetchPrepData}>Refresh</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPrep;