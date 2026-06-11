import React from 'react';
import { Lightbulb, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

const ImprovementSuggestions = ({ suggestions, missingKeywords, skillGap }) => {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Improvement Suggestions</h2>
      
      <div className="space-y-6">
        {suggestions && suggestions.length > 0 && (
          <div>
            <h3 className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Key Recommendations
            </h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <TrendingUp className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {missingKeywords && missingKeywords.length > 0 && (
          <div>
            <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {skillGap && skillGap.length > 0 && (
          <div>
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Skills to Add
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGap.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImprovementSuggestions;