import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 ${
        noPadding ? '' : 'p-4 sm:p-6'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

// Section components for consistent spacing
export const PageHeader: React.FC<{ title: string; description?: string }> = ({
  title,
  description
}) => (
  <div className="mb-6 sm:mb-8">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
    {description && (
      <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">{description}</p>
    )}
  </div>
);

export const PageSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className = '' }) => (
  <div className={`space-y-4 sm:space-y-6 ${className}`}>
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
    {children}
  </div>
);

export const CardGrid: React.FC<{
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}> = ({ children, columns = 3 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6`}>
      {children}
    </div>
  );
}; 