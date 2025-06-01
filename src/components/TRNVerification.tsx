import React from 'react';
import { illustrations } from './Illustration';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Badge from './Badge';

interface TRNVerificationProps {
  trn: string;
  companyName: string;
  licenseType: string;
  isVerified: boolean;
}

const TRNVerification: React.FC<TRNVerificationProps> = ({
  trn,
  companyName,
  licenseType,
  isVerified
}) => {
  if (!isVerified) return null;

  return (
    <div className="flex items-center space-x-6 bg-green-50 rounded-2xl p-6 border border-green-100">
      <img
        src={illustrations.trnVerified}
        alt="TRN Verified"
        className="w-24 h-24 object-contain"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900">
            TRN Verified Successfully
          </h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">TRN Number</p>
            <p className="mt-1 text-sm text-gray-900">{trn}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Company Name</p>
            <p className="mt-1 text-sm text-gray-900">{companyName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">License Type</p>
            <Badge variant="success" size="sm">
              {licenseType}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TRNVerification; 