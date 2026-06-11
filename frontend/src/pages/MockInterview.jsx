import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import InterviewSetup from '../components/interview/InterviewSetup';
import QuestionCard from '../components/interview/QuestionCard';
import VoiceRecorder from '../components/interview/VoiceRecorder';
import FacialAnalysis from '../components/interview/FacialAnalysis';
import InterviewResults from '../components/interview/InterviewResults';
import { Mic, Video, FileText, BarChart3 } from 'lucide-react';

const MockInterview = () => {
  const [step, setStep] = useState(1);
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [facialData, setFacialData] = useState([]);
  const [interviewComplete, setInterviewComplete] = useState(false);

  const handleStartInterview = async (config) => {
    setInterviewConfig(config);
    // Generate questions based on config
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(config)
    });
    const data = await response.json();
    setQuestions(data.questions);
    setStep(2);
  };

  const handleAnswerSubmit = (answer, audioBlob) => {
    setAnswers([...answers, { question: questions[currentQuestion], answer, audioBlob }]);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep(3);
    }
  };

  const handleFacialData = (data) => {
    setFacialData([...facialData, { questionIndex: currentQuestion, ...data }]);
  };

  const handleCompleteInterview = async () => {
    // Save interview results
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        type: interviewConfig.type,
        company: interviewConfig.company,
        questions: answers,
        facialAnalysis: facialData,
        completedAt: new Date()
      })
    });
    
    if (response.ok) {
      setInterviewComplete(true);
      setStep(4);
    }
  };

  const steps = [
    { number: 1, title: 'Setup', icon: <Mic /> },
    { number: 2, title: 'Interview', icon: <Video /> },
    { number: 3, title: 'Analysis', icon: <FileText /> },
    { number: 4, title: 'Results', icon: <BarChart3 /> }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s.number ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {s.number}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-400">Step {s.number}</p>
                    <p className="text-white font-semibold">{s.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step > s.number ? 'bg-indigo-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <InterviewSetup onStart={handleStartInterview} />
          )}

          {step === 2 && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuestionCard
                  question={questions[currentQuestion]}
                  questionNumber={currentQuestion + 1}
                  totalQuestions={questions.length}
                  onNext={handleAnswerSubmit}
                />
              </div>
              <div>
                <FacialAnalysis onAnalysis={handleFacialData} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-12 h-12 text-indigo-400" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Performance</h2>
              <p className="text-gray-300 mb-8">
                Our AI is evaluating your answers and communication skills...
              </p>
              <button
                onClick={handleCompleteInterview}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Complete Interview
              </button>
            </div>
          )}

          {step === 4 && interviewComplete && (
            <InterviewResults
              answers={answers}
              facialData={facialData}
              interviewConfig={interviewConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;