import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex space-x-4">
        <div className="flex-1 py-2">
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="hidden md:block flex-1 py-2">
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex-1 py-2">
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex-1 py-2">
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
