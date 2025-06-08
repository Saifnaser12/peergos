
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, { from: any; to: any }>;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditTrailLoggerProps {
  variant?: 'full' | 'summary';
  entityFilter?: string;
}

const AuditTrailLogger: React.FC<AuditTrailLoggerProps> = ({ 
  variant = 'full',
  entityFilter 
}) => {
  const { t } = useTranslation();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState({
    action: '',
    entity: entityFilter || '',
    severity: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load mock audit logs
    const mockLogs: AuditLogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-25T10:30:00Z',
        userId: 'user123',
        userName: 'Ahmed Al-Mansouri',
        action: 'VAT_RETURN_SUBMITTED',
        entity: 'VAT_RETURN',
        entityId: 'VAT-2024-001',
        changes: {
          status: { from: 'draft', to: 'submitted' },
          vatDue: { from: 0, to: 15250 }
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'high'
      },
      {
        id: '2',
        timestamp: '2024-01-25T09:15:00Z',
        userId: 'user123',
        userName: 'Ahmed Al-Mansouri',
        action: 'FINANCIAL_DATA_MODIFIED',
        entity: 'REVENUE',
        entityId: 'REV-2024-125',
        changes: {
          amount: { from: 50000, to: 55000 },
          description: { from: 'Q1 Sales', to: 'Q1 Sales - Updated' }
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'medium'
      },
      {
        id: '3',
        timestamp: '2024-01-24T16:45:00Z',
        userId: 'user456',
        userName: 'Tax Agent (Deloitte)',
        action: 'CIT_CALCULATION_REVIEWED',
        entity: 'CIT_RETURN',
        entityId: 'CIT-2024-001',
        ipAddress: '203.123.45.67',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        severity: 'medium'
      },
      {
        id: '4',
        timestamp: '2024-01-24T14:20:00Z',
        userId: 'admin789',
        userName: 'System Administrator',
        action: 'USER_PERMISSIONS_MODIFIED',
        entity: 'USER',
        entityId: 'user123',
        changes: {
          role: { from: 'user', to: 'tax_manager' },
          permissions: { from: ['read'], to: ['read', 'write', 'submit'] }
        },
        ipAddress: '10.0.0.1',
        userAgent: 'Mozilla/5.0 (Linux; Ubuntu)',
        severity: 'critical'
      },
      {
        id: '5',
        timestamp: '2024-01-24T11:30:00Z',
        userId: 'user123',
        userName: 'Ahmed Al-Mansouri',
        action: 'INVOICE_SCANNED',
        entity: 'INVOICE',
        entityId: 'INV-SCAN-2024-089',
        changes: {
          status: { from: 'pending', to: 'processed' },
          confidence: { from: 0, to: 0.95 }
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        severity: 'low'
      }
    ];

    setAuditLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  useEffect(() => {
    let filtered = auditLogs;

    if (filter.action) {
      filtered = filtered.filter(log => log.action.toLowerCase().includes(filter.action.toLowerCase()));
    }
    if (filter.entity) {
      filtered = filtered.filter(log => log.entity.toLowerCase().includes(filter.entity.toLowerCase()));
    }
    if (filter.severity) {
      filtered = filtered.filter(log => log.severity === filter.severity);
    }
    if (filter.dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filter.dateFrom));
    }
    if (filter.dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filter.dateTo));
    }

    setFilteredLogs(filtered);
  }, [filter, auditLogs]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportAuditLog = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (variant === 'summary') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Audit Activity</h4>
        <div className="space-y-2">
          {filteredLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(log.severity)}`}>
                  {log.severity}
                </span>
                <span className="text-gray-600 dark:text-gray-400">{log.action}</span>
              </div>
              <span className="text-gray-500 text-xs">{formatTimestamp(log.timestamp)}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.location.href = '/admin?tab=audit'}
          className="mt-3 w-full text-center text-blue-600 hover:text-blue-700 text-sm"
        >
          View All Audit Logs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Audit Trail
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete activity log for compliance monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4 inline mr-1" />
              Filters
            </button>
            <button
              onClick={exportAuditLog}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Filter by action"
              value={filter.action}
              onChange={(e) => setFilter({ ...filter, action: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Filter by entity"
              value={filter.entity}
              onChange={(e) => setFilter({ ...filter, entity: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={filter.severity}
              onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      )}

      {/* Audit Log Entries */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredLogs.map((log) => (
          <div key={log.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{log.action}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {log.userName} • {log.entity} {log.entityId}
                  </p>
                  {log.changes && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                      <strong>Changes:</strong>
                      <ul className="mt-1 space-y-1">
                        {Object.entries(log.changes).map(([field, change]) => (
                          <li key={field}>
                            <span className="font-mono">{field}:</span> 
                            <span className="text-red-600 dark:text-red-400 ml-1">{JSON.stringify(change.from)}</span>
                            <span className="mx-1">→</span>
                            <span className="text-green-600 dark:text-green-400">{JSON.stringify(change.to)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <EyeIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="px-6 py-8 text-center text-gray-500">
          No audit logs match the current filters.
        </div>
      )}
    </div>
  );
};

export default AuditTrailLogger;
