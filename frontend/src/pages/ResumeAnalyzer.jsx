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
      // ✅ CORRECT API ENDPOINT - /improve/:id
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
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Resume Analyzer</h1>
            <p className="text-gray-300">
              Get AI-powered insights to improve your resume and increase ATS score
            </p>
          </motion.div>

          {!analysis ? (
            <ResumeUploader onUploadComplete={handleUploadComplete} />
          ) : (
            <div className="space-y-6">
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
              
              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={generateImprovedResume}
                  isLoading={generatingImproved}
                  variant="primary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate ATS-Friendly Resume
                </Button>
                
                <Button
                  onClick={downloadReport}
                  variant="secondary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
              
              {/* Display Improved Resume */}
              {improvedResume && (
                <Card>
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-400" />
                      ATS-Friendly Resume
                    </h2>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="secondary" size="sm">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button onClick={downloadResume} variant="primary" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-gray-300 font-mono text-sm whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                    {improvedResume}
                  </pre>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;