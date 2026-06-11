import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/chatbot/ChatInterface';
import { Sparkles, MessageCircle, TrendingUp, Award } from 'lucide-react';
import Card from '../components/ui/Card';

const CareerMentor = () => {
  const quickQuestions = [
    "How do I prepare for a technical interview?",
    "What skills do I need to become a Full Stack Developer?",
    "How can I improve my resume?",
    "What's the best way to negotiate salary?",
    "How do I switch careers to tech?",
    "What are the most in-demand skills for 2024?"
  ];

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
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">AI Career Mentor</h1>
            </div>
            <p className="text-gray-300">
              Your personal AI career coach - ask anything about career growth, interviews, and skill development
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface />
            </div>
            
            <div className="space-y-6">
              <Card>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-400" />
                  Quick Questions
                </h3>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-gray-300 text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </Card>
              
              <Card>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Career Insights
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-green-400 font-semibold">Market Trend</p>
                    <p className="text-gray-300 text-sm">AI/ML jobs grew by 75% in 2023</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-blue-400 font-semibold">Top Skill</p>
                    <p className="text-gray-300 text-sm">Full Stack Development</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <p className="text-purple-400 font-semibold">Average Salary</p>
                    <p className="text-gray-300 text-sm">$120,000 - $180,000</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Interviews Completed</span>
                    <span className="text-yellow-400 font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Roadmaps Completed</span>
                    <span className="text-yellow-400 font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Coding Problems</span>
                    <span className="text-yellow-400 font-bold">45</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerMentor;