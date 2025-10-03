import React from 'react';

interface ActivityItemProps {
  icon: string;
  title: string;
  timestamp: string;
  isLast?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, timestamp, isLast = false }) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
        {!isLast && <div className="w-px flex-1 bg-black/10 dark:bg-white/10"></div>}
      </div>
      <div>
        <p className="font-medium text-black dark:text-white">{title}</p>
        <p className="text-sm text-black/60 dark:text-white/60">{timestamp}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
