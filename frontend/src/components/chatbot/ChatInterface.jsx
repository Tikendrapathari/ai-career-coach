import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chatbot/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chatbot/message`,
        { message: input },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">AI Career Mentor</h2>
            <p className="text-gray-400 text-sm">Your personal career guide</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ask me anything about your career!</p>
            <p className="text-sm mt-2">I can help with:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Resume improvement tips</li>
              <li>• Interview preparation strategies</li>
              <li>• Career roadmap planning</li>
              <li>• Skill recommendations</li>
            </ul>
          </div>
        )}
        
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message.content}
            isUser={message.role === 'user'}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your career question..."
          className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
          rows="1"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};

export default ChatInterface;