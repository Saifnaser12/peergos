import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = ''
}) => {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {icon && <span className="-ml-0.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;

// Dot indicator component
interface DotIndicatorProps {
  variant?: BadgeVariant;
  pulse?: boolean;
}

export const DotIndicator: React.FC<DotIndicatorProps> = ({
  variant = 'default',
  pulse = false
}) => {
  const variants = {
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    default: 'bg-gray-400'
  };

  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
          variants[variant]
        } ${pulse ? 'animate-ping' : ''}`}
      />
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${variants[variant]}`}
      />
    </span>
  );
}; 