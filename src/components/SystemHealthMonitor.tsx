
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ServerIcon,
  CloudIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface HealthMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value: string;
  description: string;
  lastChecked: string;
  uptime?: number;
}

interface SystemHealthMonitorProps {
  variant?: 'full' | 'compact';
}

const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({ variant = 'full' }) => {
  const { t } = useTranslation();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkSystemHealth = async () => {
    setIsRefreshing(true);
    
    // Simulate health checks
    setTimeout(() => {
      const metrics: HealthMetric[] = [
        {
          id: 'fta-connection',
          name: 'FTA API Connection',
          status: 'healthy',
          value: '200ms',
          description: 'Connection to FTA services is stable',
          lastChecked: new Date().toISOString(),
          uptime: 99.9
        },
        {
          id: 'database',
          name: 'Database Performance',
          status: 'healthy',
          value: '< 100ms',
          description: 'Database queries executing normally',
          lastChecked: new Date().toISOString(),
          uptime: 99.8
        },
        {
          id: 'encryption',
          name: 'Data Encryption',
          status: 'healthy',
          value: 'AES-256',
          description: 'All sensitive data properly encrypted',
          lastChecked: new Date().toISOString()
        },
        {
          id: 'backup',
          name: 'Data Backup Status',
          status: 'healthy',
          value: '2 hours ago',
          description: 'Latest backup completed successfully',
          lastChecked: new Date().toISOString()
        },
        {
          id: 'ssl',
          name: 'SSL Certificate',
          status: 'healthy',
          value: '364 days left',
          description: 'SSL certificate is valid and active',
          lastChecked: new Date().toISOString()
        },
        {
          id: 'compliance',
          name: 'Compliance Checks',
          status: 'warning',
          value: '2 pending',
          description: 'Minor compliance items require attention',
          lastChecked: new Date().toISOString()
        },
        {
          id: 'storage',
          name: 'Storage Usage',
          status: 'warning',
          value: '78% used',
          description: 'Storage usage approaching threshold',
          lastChecked: new Date().toISOString()
        },
        {
          id: 'api-rate',
          name: 'API Rate Limits',
          status: 'healthy',
          value: '45/1000',
          description: 'API usage within normal limits',
          lastChecked: new Date().toISOString()
        }
      ];

      setHealthMetrics(metrics);
      
      // Calculate overall status
      const errorCount = metrics.filter(m => m.status === 'error').length;
      const warningCount = metrics.filter(m => m.status === 'warning').length;
      
      if (errorCount > 0) {
        setOverallStatus('error');
      } else if (warningCount > 0) {
        setOverallStatus('warning');
      } else {
        setOverallStatus('healthy');
      }
      
      setIsRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(checkSystemHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">System Health</h4>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getOverallStatusColor()}`}>
            {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {healthMetrics.slice(0, 4).map((metric) => (
            <div key={metric.id} className="flex items-center space-x-2 text-sm">
              {getStatusIcon(metric.status)}
              <span className="text-gray-600 dark:text-gray-400 truncate">{metric.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.location.href = '/admin?tab=health'}
          className="mt-3 w-full text-center text-blue-600 hover:text-blue-700 text-sm"
        >
          View Detailed Health Report
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ServerIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Health Monitor
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time monitoring of critical system components
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getOverallStatusColor()}`}>
              Overall Status: {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
            </div>
            <button
              onClick={checkSystemHealth}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isRefreshing ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className={`p-4 rounded-lg border-2 ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {metric.name}
                  </h4>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {metric.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Last checked: {new Date(metric.lastChecked).toLocaleTimeString()}
                </span>
                {metric.uptime && (
                  <span>Uptime: {metric.uptime}%</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* System Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CloudIcon className="w-5 h-5 text-blue-500" />
              <h5 className="font-medium text-gray-900 dark:text-white">Cloud Infrastructure</h5>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Region: UAE North (Dubai)</p>
              <p>Provider: AWS</p>
              <p>Instance: t3.medium</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-500" />
              <h5 className="font-medium text-gray-900 dark:text-white">Security Status</h5>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Firewall: Active</p>
              <p>DDoS Protection: Enabled</p>
              <p>Last Security Scan: 2 hours ago</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-5 h-5 text-purple-500" />
              <h5 className="font-medium text-gray-900 dark:text-white">Performance Metrics</h5>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Avg Response Time: 245ms</p>
              <p>CPU Usage: 23%</p>
              <p>Memory Usage: 67%</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            System Recommendations
          </h5>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Consider upgrading storage capacity within 30 days</li>
            <li>• Review and address pending compliance items</li>
            <li>• Schedule regular security scans for enhanced protection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
