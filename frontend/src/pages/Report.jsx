import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FileText, Download, TrendingUp, Award, BarChart3, Target, RefreshCw } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/report/my-report`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReport(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setReport(null);
      } else {
        console.error('Error fetching report:', error);
        toast.error('Failed to fetch report');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateNewReport = async () => {
    setGenerating(true);
    toast.loading('Generating your comprehensive report...', { id: 'report-gen' });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/report/generate`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReport(response.data);
      toast.success('Report generated successfully!', { id: 'report-gen' });
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(error.response?.data?.message || 'Failed to generate report', { id: 'report-gen' });
    } finally {
      setGenerating(false);
    }
  };

  const exportPDF = async () => {
    try {
      toast.loading('Preparing PDF download...', { id: 'pdf-export' });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/report/export-pdf`,
        { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `career-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to download report', { id: 'pdf-export' });
    }
  };

  const radarData = report ? [
    { subject: 'Resume', score: Math.round(report.resumeScore?.score || 0), fullMark: 100 },
    { subject: 'Communication', score: Math.round(report.communicationScore?.score || 0), fullMark: 100 },
    { subject: 'Technical', score: Math.round(report.technicalScore?.score || 0), fullMark: 100 },
    { subject: 'Confidence', score: Math.round(report.confidenceScore?.score || 0), fullMark: 100 },
    { subject: 'Career Ready', score: Math.round(report.careerReadiness?.score || 0), fullMark: 100 }
  ] : [];

  const getLevelColor = (level) => {
    switch(level) {
      case 'expert': return 'text-purple-400';
      case 'advanced': return 'text-blue-400';
      case 'intermediate': return 'text-yellow-400';
      default: return 'text-gray-400';
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
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Career Readiness Report</h1>
                <p className="text-gray-300">
                  Comprehensive analysis of your interview performance and career preparedness
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={generateNewReport} 
                  variant="secondary" 
                  isLoading={generating}
                  disabled={generating}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New
                </Button>
                <Button 
                  onClick={exportPDF} 
                  variant="primary"
                  disabled={!report}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your report...</p>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Overall Score Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
                    <span className="text-4xl font-bold text-white">{Math.round(report.careerReadiness?.score || 0)}%</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Overall Career Readiness</h2>
                  <div className={`inline-block px-4 py-1 rounded-full border bg-white/10 mb-4`}>
                    <p className={`text-lg font-semibold ${getLevelColor(report.careerReadiness?.level)}`}>
                      {report.careerReadiness?.level?.toUpperCase()} Level
                    </p>
                  </div>
                  <p className="text-gray-300 mt-4 max-w-2xl mx-auto">{report.overallAssessment}</p>
                </Card>
              </motion.div>

              {/* Radar Chart */}
              <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  Skills Assessment
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis dataKey="subject" stroke="#ffffff60" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff60" />
                    <Radar name="Your Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              {/* Detailed Scores */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    Resume Analysis
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-white mb-1">
                      <span>ATS Score</span>
                      <span className="font-bold text-green-400">{Math.round(report.resumeScore?.score || 0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${report.resumeScore?.score || 0}%` }} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">Top Strengths:</p>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {report.resumeScore?.strengths?.slice(0, 3).map((strength, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Technical Skills
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-white mb-1">
                      <span>Technical Score</span>
                      <span className="font-bold text-blue-400">{Math.round(report.technicalScore?.score || 0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${report.technicalScore?.score || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Coding Skills:</span>
                      <span className="text-white">{Math.round(report.technicalScore?.codingSkills || 0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Problem Solving:</span>
                      <span className="text-white">{Math.round(report.technicalScore?.problemSolving || 0)}%</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Communication Skills
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-white mb-1">
                      <span>Communication Score</span>
                      <span className="font-bold text-purple-400">{Math.round(report.communicationScore?.score || 0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${report.communicationScore?.score || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Filler Words:</span>
                      <span className="text-white">{report.communicationScore?.fillerWords || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Grammar Errors:</span>
                      <span className="text-white">{report.communicationScore?.grammarErrors || 0}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    Confidence & Body Language
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-white mb-1">
                      <span>Confidence Score</span>
                      <span className="font-bold text-yellow-400">{Math.round(report.confidenceScore?.score || 0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${report.confidenceScore?.score || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Eye Contact:</span>
                      <span className="text-white">{Math.round(report.confidenceScore?.eyeContact || 0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Voice Clarity:</span>
                      <span className="text-white">{Math.round(report.confidenceScore?.voiceClarity || 0)}%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Recommendations & Next Steps
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Recommended Actions:</h4>
                    <div className="space-y-2">
                      {report.careerReadiness?.recommendations?.map((rec, index) => (
                        <div key={index} className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                          <p className="text-indigo-400">📌 {rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-white font-semibold mb-3">Suggested Next Steps:</h4>
                    <ul className="space-y-2">
                      {report.careerReadiness?.nextSteps?.map((step, index) => (
                        <li key={index} className="text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 font-bold">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl text-white mb-2">No Report Available</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Complete some mock interviews, upload your resume, and practice coding problems to generate a comprehensive career readiness report.
              </p>
              <Button onClick={generateNewReport} isLoading={generating} variant="primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;