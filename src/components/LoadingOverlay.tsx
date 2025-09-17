import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-base-100/50 flex items-center justify-center z-50">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default LoadingOverlay;
