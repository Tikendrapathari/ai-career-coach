import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Mic, Brain, Download, Share2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const InterviewResults = ({ answers, facialData, interviewConfig }) => {
  const calculateAverageScore = () => {
    const total = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    return total / answers.length;
  };

  const radarData = [
    { subject: 'Communication', score: interviewConfig.scores?.communication || 75 },
    { subject: 'Technical', score: interviewConfig.scores?.technical || 70 },
    { subject: 'Confidence', score: interviewConfig.scores?.confidence || 80 },
    { subject: 'Clarity', score: 78 },
    { subject: 'Relevance', score: 82 }
  ];

  const scoreData = answers.map((a, i) => ({
    question: i + 1,
    score: a.score || 75
  }));

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
            <span className="text-4xl font-bold text-white">{Math.round(calculateAverageScore() * 10)}%</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
          <p className="text-gray-300 mb-4">
            {interviewConfig.type.toUpperCase()} Interview - {interviewConfig.company || 'General'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="secondary">
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Performance by Question
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="question" stroke="#ffffff60" />
              <YAxis domain={[0, 100]} stroke="#ffffff60" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Skills Assessment
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" stroke="#ffffff60" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff60" />
              <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5 text-green-400" />
          Detailed Feedback
        </h3>
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-indigo-400 font-semibold">Question {index + 1}</h4>
                <span className="text-yellow-400 font-bold">{answer.score || 75}%</span>
              </div>
              <p className="text-white text-sm mb-2">{answer.question}</p>
              <p className="text-gray-400 text-sm mb-2">Your Answer: {answer.answer}</p>
              <p className="text-green-400 text-sm">Feedback: {answer.feedback || "Good answer! Keep practicing to improve further."}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Recommendations for Improvement
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">•</span>
            Practice more behavioral questions to improve communication score
          </li>
          <li className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">•</span>
            Work on technical concepts specific to {interviewConfig.role || 'your target role'}
          </li>
          <li className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">•</span>
            Record yourself answering questions to improve confidence
          </li>
          <li className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">•</span>
            Review company-specific preparation materials
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default InterviewResults;