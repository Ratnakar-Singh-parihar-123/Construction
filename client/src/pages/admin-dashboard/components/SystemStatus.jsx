import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = ({ status }) => {
  const getStatusColor = (state) => {
    const colors = {
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      info: 'bg-primary/10 text-primary border-primary/20'
    };
    return colors?.[state] || 'bg-muted text-muted-foreground border-border';
  };

  const getStatusIcon = (state) => {
    const icons = {
      success: 'CheckCircle2',
      warning: 'AlertTriangle',
      error: 'XCircle',
      info: 'Info'
    };
    return icons?.[state] || 'Circle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">System Status</h3>
        <p className="text-sm text-muted-foreground">Monitor shop operations</p>
      </div>
      <div className="space-y-3">
        {status?.map((item) => (
          <div key={item?.id} className={`p-4 border rounded-lg ${getStatusColor(item?.state)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Icon name={getStatusIcon(item?.state)} size={20} />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{item?.title}</h4>
                  <p className="text-xs opacity-80">{item?.message}</p>
                  <p className="text-xs opacity-60 mt-1">{item?.timestamp}</p>
                </div>
              </div>
              {item?.action && (
                <button className="text-xs font-medium hover:underline ml-2 flex-shrink-0">
                  {item?.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;