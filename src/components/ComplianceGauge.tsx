import React from 'react';
import { illustrations } from './Illustration';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ComplianceGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({
  score,
  size = 'md',
  showIcon = true
}) => {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    if (score >= 60) return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
    return <XCircleIcon className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className={`relative ${sizes[size]}`}>
        <img
          src={illustrations.complianceGauge}
          alt="Compliance Score Gauge"
          className="w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
        </div>
      </div>
      {showIcon && (
        <div className="mt-2 flex items-center space-x-2">
          {getScoreIcon(score)}
          <span className={`text-sm font-medium ${getScoreColor(score)}`}>
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ComplianceGauge; 