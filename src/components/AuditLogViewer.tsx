import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { useUserRole } from '../context/UserRoleContext';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

const AuditLogViewer: React.FC = () => {
  const { getRecentEntries, clearLog } = useAudit();
  const { role } = useUserRole();
  const [limit, setLimit] = useState(50);

  if (role !== 'Admin') {
    return null;
  }

  const entries = getRecentEntries(limit);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Audit Log
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Recent system activities and user actions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={25}>Last 25</option>
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
          </select>
          <button
            onClick={clearLog}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Clear Log
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {entries.map((entry) => (
            <li key={entry.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-sm font-medium text-gray-600">
                    {formatTimestamp(entry.timestamp)}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {entry.role}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="text-sm text-gray-900">
                    {formatAction(entry.action)}
                  </p>
                </div>
                {entry.details && (
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p className="text-xs font-mono bg-gray-100 rounded px-2 py-1">
                      {JSON.stringify(entry.details)}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditLogViewer; 