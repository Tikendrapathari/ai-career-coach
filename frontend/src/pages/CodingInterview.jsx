import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import CodeEditor from '../components/coding/CodeEditor';
import ProblemDescription from '../components/coding/ProblemDescription';
import AIHint from '../components/coding/AIHint';
import { Play, RefreshCw, Lightbulb } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import axios from 'axios';
import toast from 'react-hot-toast';

const CodingInterview = () => {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n  \n}');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');

  // Generate New Problem
  const generateProblem = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coding/generate-problem`,
        { difficulty: 'medium', topic: 'array' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setProblem(response.data);
      setCode('// Write your solution here\nfunction solution() {\n  \n}');
      setOutput('');
      setEvaluation(null);
      toast.success('New Problem Generated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate problem');
    } finally {
      setIsLoading(false);
    }
  };

  // Run Code & Get Evaluation
  const runCode = async () => {
    if (!problem) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coding/evaluate`,
        { code, language, problemId: problem.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const evalData = response.data;
      setEvaluation(evalData);

      // Create nice output display
      let displayOutput = evalData.output || evalData.feedback || '';

      if (evalData.testResults && evalData.testResults.length > 0) {
        displayOutput = evalData.testResults.map((test, index) => 
          `Test Case ${index + 1}: ${test.passed ? '✅ PASSED' : '❌ FAILED'}\n` +
          `Input: ${test.testCase}\n` +
          `Expected: ${test.expected}\n` +
          `Actual: ${test.actual || 'N/A'}`
        ).join('\n\n');
      }

      setOutput(displayOutput || 'Evaluation completed successfully.');
      toast.success(`Score: ${evalData.score}%`);
    } catch (error) {
      console.error(error);
      toast.error('Evaluation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Get AI Hint
  const getHintFunc = async () => {
    if (!problem) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coding/hint`,
        { problemId: problem.id, userCode: code },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setHint(response.data.hint);
      setShowHint(true);
    } catch (error) {
      toast.error('Failed to get hint');
    } finally {
      setIsLoading(false);
    }
  };

  // Load New Problem
  const loadNewProblem = () => {
    setProblem(null);
    setEvaluation(null);
    setOutput('');
    setHint('');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Coding Interview Practice</h1>
              <p className="text-gray-400">Practice DSA problems with AI-powered hints and evaluation</p>
            </div>
            
            {problem && (
              <Button onClick={loadNewProblem} variant="secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                New Problem
              </Button>
            )}
          </div>

          {!problem ? (
            <Card className="text-center py-20">
              <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl text-white mb-3">Start Coding Practice</h3>
              <p className="text-gray-400 mb-8">Click below to get a new DSA challenge</p>
              <Button onClick={generateProblem} isLoading={isLoading} size="lg">
                Generate Problem
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Problem Description */}
              <ProblemDescription problem={problem} />

              {/* Code Editor + Output */}
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>

                  <div className="flex gap-3">
                    <Button onClick={getHintFunc} variant="outline" size="sm">
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Hint
                    </Button>
                    <Button onClick={runCode} isLoading={isLoading}>
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </Button>
                  </div>
                </div>

                <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                  language={language} 
                />

                {/* Output Section */}
                <div className="mt-6">
                  <h3 className="text-white font-semibold mb-3">Output & Evaluation</h3>
                  <pre className="p-5 bg-black/70 rounded-xl text-green-400 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[320px] border border-gray-700">
                    {output || 'Click "Run Code" to test your solution'}
                  </pre>

                  {evaluation && (
                    <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-400">
                          Score: {evaluation.score}%
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2">{evaluation.feedback}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <AIHint 
        hint={hint} 
        show={showHint} 
        onClose={() => setShowHint(false)} 
      />
    </div>
  );
};

export default CodingInterview;