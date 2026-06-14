import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ResumeUploader from '../components/resume/ResumeUploader';
import ResumeScore from '../components/resume/ResumeScore';
import ImprovementSuggestions from '../components/resume/ImprovementSuggestions';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Download, Sparkles, FileText, Copy, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeAnalyzer = () => {
  const [analysis, setAnalysis] = useState(null);
  const [generatingImproved, setGeneratingImproved] = useState(false);
  const [improvedResume, setImprovedResume] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleUploadComplete = (data) => {
    setAnalysis(data);
    setImprovedResume(null);
  };

  const generateImprovedResume = async () => {
    if (!analysis?.id) {
      toast.error('Please upload a resume first');
      return;
    }
    
    setGeneratingImproved(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/improve/${analysis.id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (response.data?.improvedResume) {
        setImprovedResume(response.data.improvedResume);
        toast.success('ATS-Friendly Resume generated successfully!');
      } else {
        toast.error('Failed to generate improved resume');
      }
    } catch (error) {
      console.error('Error generating improved resume:', error);
      toast.error(error.response?.data?.message || 'Failed to generate improved resume');
    } finally {
      setGeneratingImproved(false);
    }
  };

  const copyToClipboard = async () => {
    if (improvedResume) {
      await navigator.clipboard.writeText(improvedResume);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResume = () => {
    if (improvedResume) {
      const blob = new Blob([improvedResume], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ats-friendly-resume-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Resume downloaded!');
    }
  };

  const downloadReport = () => {
    if (analysis) {
      const reportData = {
        atsScore: analysis.atsScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingKeywords: analysis.missingKeywords,
        skillGap: analysis.skillGap,
        suggestions: analysis.suggestions,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-analysis-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        <div className="pt-14 lg:pt-0">
          <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 sm:mb-8"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Resume Analyzer</h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Get AI-powered insights to improve your resume and increase ATS score
              </p>
            </motion.div>

            {!analysis ? (
              <ResumeUploader onUploadComplete={handleUploadComplete} />
            ) : (
              <div className="space-y-5 sm:space-y-6">
                <ResumeScore 
                  score={analysis.atsScore}
                  strengths={analysis.strengths}
                  weaknesses={analysis.weaknesses}
                />
                
                <ImprovementSuggestions 
                  suggestions={analysis.suggestions}
                  missingKeywords={analysis.missingKeywords}
                  skillGap={analysis.skillGap}
                />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={generateImprovedResume}
                    isLoading={generatingImproved}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate ATS-Friendly Resume
                  </Button>
                  
                  <Button
                    onClick={downloadReport}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
                
                {improvedResume && (
                  <Card>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-400" />
                        ATS-Friendly Resume
                      </h2>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button onClick={copyToClipboard} variant="secondary" size="sm" className="flex-1 sm:flex-initial">
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button onClick={downloadResume} variant="primary" size="sm" className="flex-1 sm:flex-initial">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-black/30 p-3 sm:p-4 rounded-lg overflow-x-auto text-gray-300 font-mono text-xs sm:text-sm whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                      {improvedResume}
                    </pre>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
