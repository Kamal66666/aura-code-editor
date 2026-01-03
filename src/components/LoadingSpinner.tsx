import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="text-gray-600 font-medium">Loading Editor...</div>
        <div className="text-sm text-gray-400">Restoring your workspace</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
