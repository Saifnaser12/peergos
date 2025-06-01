import React from 'react';
import { illustrations } from './Illustration';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import Badge from './Badge';

interface AuditScheduleProps {
  nextAuditDate?: string;
  lastAuditDate?: string;
  status: 'scheduled' | 'completed' | 'none';
}

const AuditSchedule: React.FC<AuditScheduleProps> = ({
  nextAuditDate,
  lastAuditDate,
  status
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="info" icon={<CalendarIcon className="h-4 w-4" />}>Scheduled</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="warning">No Audit Scheduled</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start space-x-4">
        <img
          src={illustrations.auditIcon}
          alt="Audit Schedule"
          className="w-12 h-12 object-contain"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Tax Audit Schedule
            </h3>
            {getStatusBadge()}
          </div>
          <div className="mt-4 space-y-3">
            {nextAuditDate && (
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">Next Audit:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(nextAuditDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {lastAuditDate && (
              <div className="flex items-center text-sm">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">Last Audit:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(lastAuditDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditSchedule; 