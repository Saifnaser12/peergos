import React, { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

interface ComplianceBadgesProps {
  revenue: number;
}

const ComplianceBadges: React.FC<ComplianceBadgesProps> = ({ revenue }) => {
  const [animate, setAnimate] = useState(false);
  const [prevRevenue, setPrevRevenue] = useState(revenue);

  useEffect(() => {
    if (revenue !== prevRevenue) {
      setAnimate(true);
      setPrevRevenue(revenue);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [revenue, prevRevenue]);

  const getBadgeContent = () => {
    if (revenue > 3000000) {
      return {
        icon: <ExclamationCircleIcon className="h-5 w-5" />,
        text: 'VAT + CIT Required',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        tooltip: 'Your revenue exceeds AED 3M. Both VAT and Corporate Income Tax registration are mandatory.'
      };
    }
    if (revenue > 375000) {
      return {
        icon: <InformationCircleIcon className="h-5 w-5" />,
        text: 'VAT Only',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        tooltip: 'Your revenue exceeds AED 375K. VAT registration is mandatory.'
      };
    }
    return {
      icon: <CheckCircleIcon className="h-5 w-5" />,
      text: 'No Tax Filing Required',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      tooltip: 'Your revenue is below the tax thresholds. No mandatory tax filings are required at this time.'
    };
  };

  const badge = getBadgeContent();

  return (
    <div className="flex flex-col space-y-2">
      <Tooltip content={badge.tooltip}>
        <div
          className={`
            inline-flex items-center px-3 py-1 rounded-full border
            ${badge.bgColor} ${badge.textColor} ${badge.borderColor}
            ${animate ? 'animate-bounce' : ''}
            transition-colors duration-200
          `}
        >
          <span className="mr-1.5">{badge.icon}</span>
          <span className="text-sm font-medium">{badge.text}</span>
        </div>
      </Tooltip>
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <span>0</span>
        <span>375K</span>
        <span>3M+</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            revenue > 3000000
              ? 'bg-red-500 w-full'
              : revenue > 375000
              ? 'bg-blue-500 w-2/3'
              : 'bg-green-500 w-1/3'
          }`}
        />
      </div>
    </div>
  );
};

export default ComplianceBadges; 