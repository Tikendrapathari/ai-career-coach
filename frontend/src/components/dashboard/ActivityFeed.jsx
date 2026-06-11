import React from 'react';
import { Clock } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      interview: '🎙️',
      resume: '📄',
      coding: '💻',
      roadmap: '🗺️'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div>
              <p className="text-white font-medium">{activity.title}</p>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.date}
              </p>
            </div>
          </div>
          {activity.score && (
            <span className="text-green-400 font-semibold">Score: {activity.score}%</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;