import React from 'react';
import AuditLogViewer from '../components/AuditLogViewer';

const Admin: React.FC = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <div className="mt-6">
          <AuditLogViewer />
        </div>
      </div>
    </div>
  );
};

export default Admin; 