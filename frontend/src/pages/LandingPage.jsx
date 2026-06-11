import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Brain, 
  Mic, 
  Code, 
  Target, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
      title: "AI Resume Analyzer",
      description: "Get ATS score and improvement suggestions"
    },
    {
      icon: <Mic className="w-8 h-8 text-purple-400" />,
      title: "Voice Interviews",
      description: "Practice with voice-enabled AI interviewer"
    },
    {
      icon: <Code className="w-8 h-8 text-blue-400" />,
      title: "Coding Practice",
      description: "Solve DSA problems with AI hints"
    },
    {
      icon: <Brain className="w-8 h-8 text-indigo-400" />,
      title: "Career Mentor",
      description: "24/7 AI career guidance chatbot"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-400" />,
      title: "Personalized Roadmap",
      description: "Custom learning path for your dream job"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Detailed Analytics",
      description: "Track your progress and improvements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              AI-Powered Career
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Coach
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Master your interviews with AI mock interviews, resume analysis, and personalized career guidance
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-3 bg-white/10 backdrop-blur-lg text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-300">
              Comprehensive AI tools for your career growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "95%", label: "Success Rate" },
              { number: "50K+", label: "Interviews Completed" },
              { number: "4.9", label: "User Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of successful candidates who landed their dream jobs
            </p>
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;