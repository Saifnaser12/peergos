import React from 'react';

interface IllustrationProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Illustration: React.FC<IllustrationProps> = ({
  src,
  alt,
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Illustration;

// Predefined illustrations with consistent paths
export const illustrations = {
  dashboardEmpty: '/assets/dashboard_empty.svg',
  trnVerified: '/assets/trn_search_verified.svg',
  noDataFolder: '/assets/no_data_folder.svg',
  auditIcon: '/assets/audit_icon.svg',
  complianceGauge: '/assets/compliance_score_gauge.svg'
};

// Empty state component with illustration
interface EmptyStateProps {
  illustration: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Illustration
        src={illustration}
        alt={title}
        size="lg"
        className="mb-6"
      />
      <h3 className="text-lg font-medium text-gray-900 text-center">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 text-center max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}; 