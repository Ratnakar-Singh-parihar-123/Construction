import React from 'react';

const MetricCard = ({ metric }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={metric.onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.iconColor} shadow-md`}>
          <div className="text-white">
            {metric.icon}
          </div>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          metric.changeType === 'positive'
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
        }`}>
          {metric.change}
        </span>
      </div>
      
      <div>
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {metric.value}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          {metric.title}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {metric.trend}
            </p>
            {metric.detail && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.detail}</p>
            )}
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center">
            View
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;