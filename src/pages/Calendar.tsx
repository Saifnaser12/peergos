import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../context/NotificationContext';
import { useTax } from '../context/TaxContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Calendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { notifications } = useNotifications();
  const { profile } = useTax();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const isRTL = i18n.language === 'ar';

  // Generate calendar deadlines
  const generateDeadlines = () => {
    const deadlines = [];
    const today = new Date();

    // VAT deadlines - 28th of each month
    for (let month = 0; month < 12; month++) {
      deadlines.push({
        id: `vat-${month}`,
        type: 'VAT',
        title: t('calendar.vatReturn'),
        date: new Date(selectedYear, month + 1, 28),
        dueDate: new Date(selectedYear, month + 1, 28),
        priority: 'high',
        status: new Date(selectedYear, month + 1, 28) < today ? 'overdue' : 'upcoming'
      });
    }

    // CIT deadline
    if (profile?.citSubmissionDate) {
      const citDate = new Date(profile.citSubmissionDate);
      deadlines.push({
        id: 'cit-annual',
        type: 'CIT',
        title: t('calendar.citReturn'),
        date: citDate,
        dueDate: citDate,
        priority: 'urgent',
        status: citDate < today ? 'overdue' : 'upcoming'
      });
    }

    return deadlines.filter(deadline => 
      deadline.date.getMonth() === selectedMonth && 
      deadline.date.getFullYear() === selectedYear
    );
  };

  const deadlines = generateDeadlines();
  const currentMonth = new Date(selectedYear, selectedMonth, 1);

  const getPriorityColor = (deadline: any) => {
    // Smart urgency based on days remaining
    const daysRemaining = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (deadline.status === 'completed') {
      return 'text-green-600 bg-green-100 border-green-300';
    }
    if (deadline.status === 'overdue' || daysRemaining < 0) {
      return 'text-red-600 bg-red-100 border-red-300';
    }
    if (daysRemaining <= 7) {
      return 'text-red-600 bg-red-100 border-red-300'; // 🔴 High (due in < 7 days)
    }
    if (daysRemaining <= 30) {
      return 'text-yellow-600 bg-yellow-100 border-yellow-300'; // 🟡 Medium (7–30 days)
    }
    return 'text-blue-600 bg-blue-100 border-blue-300'; // 🟢 Low (> 30 days)
  };

  const getUrgencyFlag = (deadline: any) => {
    const daysRemaining = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (deadline.status === 'completed') return '✅';
    if (deadline.status === 'overdue' || daysRemaining < 0) return '🔴';
    if (daysRemaining <= 7) return '🔴';
    if (daysRemaining <= 30) return '🟡';
    return '🟢';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('calendar.title', 'Tax Calendar & Deadlines')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('calendar.subtitle', 'Track your tax filing deadlines and compliance dates')}
          </p>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="block w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleDateString(i18n.language, { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="block w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={2024 + i}>
                  {2024 + i}
                </option>
              ))}
            </select>
          </div>
          <CalendarDaysIcon className="h-6 w-6 text-gray-400" />
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {t(`calendar.days.${day.toLowerCase()}`, day)}
            </div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: 42 }, (_, i) => {
            const date = new Date(selectedYear, selectedMonth, 1 - currentMonth.getDay() + i);
            const isCurrentMonth = date.getMonth() === selectedMonth;
            const isToday = date.toDateString() === new Date().toDateString();
            const dayDeadlines = deadlines.filter(d => d.date.toDateString() === date.toDateString());
            const hasDeadline = dayDeadlines.length > 0;
            
            // Smart completion logic - check if deadline is completed
            const getDeadlineColor = (deadline: any) => {
              if (deadline.status === 'completed') return 'bg-green-500'; // ✅ submitted
              if (deadline.status === 'overdue') return 'bg-red-500'; // 🔴 overdue
              const daysUntil = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              if (daysUntil <= 7) return 'bg-yellow-500'; // 🟡 due soon
              return 'bg-blue-500'; // 🟢 future
            };

            return (
              <div
                key={i}
                className={`
                  relative p-2 text-center text-sm border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${isCurrentMonth 
                    ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                    : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                  }
                  ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  ${hasDeadline ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                `}
                title={dayDeadlines.length > 0 ? dayDeadlines.map(d => `${d.title} - ${d.type}`).join('\n') : ''}
              >
                <div className="flex items-center justify-center h-8">
                  <span className={dayDeadlines.some(d => d.status === 'completed') ? 'line-through' : ''}>
                    {date.getDate()}
                  </span>
                  {hasDeadline && (
                    <div className="ml-1 flex flex-col space-y-1">
                      {dayDeadlines.slice(0, 3).map((deadline, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${getDeadlineColor(deadline)}`} />
                      ))}
                      {dayDeadlines.length > 3 && (
                        <div className="text-xs text-gray-500">+{dayDeadlines.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
                {dayDeadlines.some(d => d.status === 'completed') && (
                  <div className="absolute top-1 right-1">
                    <CheckCircleIcon className="h-3 w-3 text-green-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deadlines List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('calendar.upcomingDeadlines', 'Upcoming Deadlines')}
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {deadlines.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {t('calendar.noDeadlines', 'No deadlines this month')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('calendar.noDeadlinesDesc', 'All your tax obligations are up to date.')}
              </p>
            </div>
          ) : (
            deadlines.map((deadline) => {
              const daysRemaining = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={deadline.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(deadline.status)}
                      <div>
                        <h4 className={`text-sm font-medium ${deadline.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {deadline.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {deadline.type} • {deadline.date.toLocaleDateString(i18n.language)}
                          {daysRemaining >= 0 && deadline.status !== 'completed' && (
                            <span className="ml-2">
                              ({daysRemaining === 0 ? t('calendar.dueToday', 'Due Today') : 
                                daysRemaining === 1 ? t('calendar.dueTomorrow', 'Due Tomorrow') :
                                t('calendar.daysRemaining', `${daysRemaining} days remaining`)})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getUrgencyFlag(deadline)}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(deadline)}`}>
                        {deadline.status === 'completed' ? t('calendar.completed', 'Completed') :
                         daysRemaining < 0 ? t('calendar.overdue', 'Overdue') :
                         daysRemaining <= 7 ? t('calendar.urgent', 'Urgent') :
                         daysRemaining <= 30 ? t('calendar.medium', 'Medium') :
                         t('calendar.low', 'Low')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active Notifications */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <BellIcon className="h-5 w-5 mr-2" />
            {t('calendar.activeNotifications', 'Active Notifications')}
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Integration Alerts */}
          {(!profile?.isSetupComplete) && (
            <div className="px-6 py-4 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      ❗ {t('calendar.setupIncomplete', 'Setup Incomplete')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('calendar.completeSetup', 'Complete your company setup to ensure compliance')}
                    </p>
                    <a href="/setup" className="text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block">
                      {t('calendar.goToSetup', 'Go to Setup →')}
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{t('calendar.dismiss', 'Dismiss')}</span>
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {(!profile?.taxAgentCertificate) && (
            <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      ❗ {t('calendar.taxAgentMissing', 'Tax Agent Certificate Missing')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('calendar.uploadCertificate', 'Upload your tax agent certificate to complete filing')}
                    </p>
                    <a href="/corporate-tax" className="text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block">
                      {t('calendar.goToFiling', 'Go to Filing →')}
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{t('calendar.remindLater', 'Remind Me Later')}</span>
                  ⏰
                </button>
              </div>
            </div>
          )}

          {(!profile?.bankSlip) && (
            <div className="px-6 py-4 bg-orange-50 dark:bg-orange-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      ❗ {t('calendar.bankSlipMissing', 'Bank Slip Missing')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('calendar.uploadBankSlip', 'Upload payment transfer slip for tax compliance')}
                    </p>
                    <a href="/corporate-tax" className="text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block">
                      {t('calendar.goToFiling', 'Go to Filing →')}
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{t('calendar.dismiss', 'Dismiss')}</span>
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Regular Notifications */}
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    notification.priority === 'urgent' ? 'bg-red-500' :
                    notification.priority === 'high' ? 'bg-orange-500' :
                    notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    {notification.daysRemaining !== undefined && (
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.daysRemaining === 0 
                          ? t('notifications.dueToday')
                          : t('notifications.daysRemaining', { days: notification.daysRemaining })
                        }
                      </p>
                    )}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{t('calendar.dismiss', 'Dismiss')}</span>
                  ✕
                </button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="px-6 py-8 text-center">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {t('notifications.noNotifications')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('notifications.allCaughtUp')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;