import React from 'react';
import { Lightbulb, X } from 'lucide-react';
import Card from '../ui/Card';

const AIHint = ({ hint, show, onClose }) => {
  if (!show) return null;

  return (
    <Card className="relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-yellow-400 font-semibold mb-2">AI Hint</h3>
          <p className="text-gray-300">{hint}</p>
        </div>
      </div>
    </Card>
  );
};

export default AIHint;