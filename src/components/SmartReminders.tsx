
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CalendarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const SmartReminders: React.FC = () => {
  const { t } = useTranslation();

  const reminders = [
    {
      type: 'deadline',
      title: 'VAT Return Due',
      description: 'Next VAT filing deadline in 15 days',
      date: '2024-02-28',
      priority: 'high',
      icon: ExclamationTriangleIcon,
      color: 'red'
    },
    {
      type: 'insight',
      title: 'Revenue Growth Trend',
      description: '23% increase in Q4 revenue detected',
      priority: 'medium',
      icon: ChartBarIcon,
      color: 'green'
    },
    {
      type: 'compliance',
      title: 'Transfer Pricing Review',
      description: 'Annual TP documentation review recommended',
      priority: 'medium',
      icon: ClockIcon,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700',
      green: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700',
      yellow: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700',
      blue: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          🧠 Smart Reminders & Insights
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          AI-powered notifications and business intelligence
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {reminders.map((reminder, index) => {
            const Icon = reminder.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getColorClasses(reminder.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {reminder.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reminder.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                          : reminder.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                      }`}>
                        {reminder.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {reminder.description}
                    </p>
                    {reminder.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {reminder.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmartReminders;
