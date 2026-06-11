import React from 'react';
import Card from '../ui/Card';

const ProblemDescription = ({ problem }) => {
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-white">{problem.title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problem.difficulty)} bg-white/10`}>
          {problem.difficulty}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-indigo-400 font-semibold mb-2">Description</h3>
          <p className="text-gray-300">{problem.description}</p>
        </div>
        
        {problem.constraints && problem.constraints.length > 0 && (
          <div>
            <h3 className="text-indigo-400 font-semibold mb-2">Constraints</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {problem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}
        
        {problem.examples && problem.examples.length > 0 && (
          <div>
            <h3 className="text-indigo-400 font-semibold mb-2">Examples</h3>
            {problem.examples.map((example, index) => (
              <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                <p className="text-gray-300">
                  <span className="text-yellow-400">Input:</span> {example.input}
                </p>
                <p className="text-gray-300">
                  <span className="text-yellow-400">Output:</span> {example.output}
                </p>
                {example.explanation && (
                  <p className="text-gray-400 text-sm mt-1">
                    <span className="text-yellow-400">Explanation:</span> {example.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProblemDescription;