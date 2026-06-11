import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-indigo-500' : 'bg-purple-500'
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>
      
      <div className={`max-w-[70%] rounded-lg p-3 ${
        isUser ? 'bg-indigo-500/20 text-white' : 'bg-white/10 text-gray-200'
      }`}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageBubble;