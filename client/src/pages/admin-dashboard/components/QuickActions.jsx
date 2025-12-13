import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-2">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Manage your shop efficiently</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleActionClick(action?.path)}
            className="relative p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-micro text-left group"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${action?.iconColor} group-hover:scale-110 transition-spring`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">{action?.title}</h4>
                <p className="text-xs text-muted-foreground">{action?.description}</p>
              </div>
            </div>
            {action?.badge && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-error rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{action?.badge}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;