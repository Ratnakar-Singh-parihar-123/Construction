import React from 'react';

import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onActivate, onDeactivate, onExport, onSendMessage }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-slide-in-up">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{selectedCount}</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedCount} customer{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="UserCheck"
              iconPosition="left"
              onClick={onActivate}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="UserX"
              iconPosition="left"
              onClick={onDeactivate}
            >
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
              iconPosition="left"
              onClick={onSendMessage}
            >
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onExport}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;