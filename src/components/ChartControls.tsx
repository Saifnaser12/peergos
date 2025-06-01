import React from 'react';
import { ChartBarIcon, ChartPieIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export type ChartType = 'line' | 'bar';

interface ChartControlsProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  onDownload?: () => void;
  chartTitle?: string;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
  onDownload,
  chartTitle
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{chartTitle}</h3>
      <div className="flex items-center space-x-4">
        <div className="inline-flex items-center p-0.5 rounded-lg bg-gray-100 shadow-sm">
          <button
            type="button"
            onClick={() => onChartTypeChange('line')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
              chartType === 'line'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChartPieIcon className="h-4 w-4 mr-1.5" />
            Line
          </button>
          <button
            type="button"
            onClick={() => onChartTypeChange('bar')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
              chartType === 'bar'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChartBarIcon className="h-4 w-4 mr-1.5" />
            Bar
          </button>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ChartControls; 