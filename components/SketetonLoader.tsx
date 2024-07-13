import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex space-x-4">
        <div className="flex-1 py-2">
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
        <div className="hidden flex-1 py-2 md:block">
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
        <div className="flex-1 py-2">
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
        <div className="flex-1 py-2">
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
