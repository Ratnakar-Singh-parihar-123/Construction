import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const CCTVSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Recording Settings
    autoRecord: true,
    recordOnMotion: true,
    recordDuration: 30, // minutes
    maxStorage: 500, // GB
    overwriteOldest: true,
    
    // Motion Detection
    motionSensitivity: 75,
    motionAreas: [],
    sendAlerts: true,
    alertEmail: true,
    alertPush: true,
    
    // Video Settings
    defaultQuality: 'hd',
    frameRate: 30,
    enableAudio: true,
    watermark: true,
    watermarkText: 'ConstructHub Pro',
    
    // Storage Settings
    cloudBackup: false,
    backupFrequency: 'daily',
    retentionPeriod: 30, // days
    
    // Notification Settings
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '06:00',
  });

  const [activeTab, setActiveTab] = useState('recording');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'recording', label: 'Recording', icon: 'Video' },
    { id: 'motion', label: 'Motion Detection', icon: 'Activity' },
    { id: 'video', label: 'Video Settings', icon: 'Camera' },
    { id: 'storage', label: 'Storage', icon: 'Database' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'system', label: 'System', icon: 'Settings' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recording':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Recording Options</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Auto Record</span>
                    <input
                      type="checkbox"
                      checked={settings.autoRecord}
                      onChange={(e) => handleSettingChange('autoRecord', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Record on Motion</span>
                    <input
                      type="checkbox"
                      checked={settings.recordOnMotion}
                      onChange={(e) => handleSettingChange('recordOnMotion', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Overwrite Oldest</span>
                    <input
                      type="checkbox"
                      checked={settings.overwriteOldest}
                      onChange={(e) => handleSettingChange('overwriteOldest', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Recording Duration (minutes)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={settings.recordDuration}
                    onChange={(e) => handleSettingChange('recordDuration', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5 min</span>
                    <span className="font-medium">{settings.recordDuration} min</span>
                    <span>120 min</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Storage (GB)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={settings.maxStorage}
                    onChange={(e) => handleSettingChange('maxStorage', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>50 GB</span>
                    <span className="font-medium">{settings.maxStorage} GB</span>
                    <span>2000 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'motion':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motion Sensitivity
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.motionSensitivity}
                onChange={(e) => handleSettingChange('motionSensitivity', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Low</span>
                <span className="font-medium">{settings.motionSensitivity}%</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Alert Settings</h4>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Send Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.sendAlerts}
                  onChange={(e) => handleSettingChange('sendAlerts', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Email Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.alertEmail}
                  onChange={(e) => handleSettingChange('alertEmail', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.alertPush}
                  onChange={(e) => handleSettingChange('alertPush', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Quality
                </label>
                <select
                  value={settings.defaultQuality}
                  onChange={(e) => handleSettingChange('defaultQuality', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sd">SD (480p)</option>
                  <option value="hd">HD (720p)</option>
                  <option value="fullhd">Full HD (1080p)</option>
                  <option value="4k">4K</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Rate (FPS)
                </label>
                <select
                  value={settings.frameRate}
                  onChange={(e) => handleSettingChange('frameRate', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 FPS</option>
                  <option value={20}>20 FPS</option>
                  <option value={25}>25 FPS</option>
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Enable Audio Recording</span>
                <input
                  type="checkbox"
                  checked={settings.enableAudio}
                  onChange={(e) => handleSettingChange('enableAudio', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Watermark</span>
                <input
                  type="checkbox"
                  checked={settings.watermark}
                  onChange={(e) => handleSettingChange('watermark', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              
              {settings.watermark && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={settings.watermarkText}
                    onChange={(e) => handleSettingChange('watermarkText', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'storage':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Cloud Backup</span>
                <input
                  type="checkbox"
                  checked={settings.cloudBackup}
                  onChange={(e) => handleSettingChange('cloudBackup', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              
              {settings.cloudBackup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retention Period (days)
              </label>
              <input
                type="range"
                min="1"
                max="365"
                value={settings.retentionPeriod}
                onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 day</span>
                <span className="font-medium">{settings.retentionPeriod} days</span>
                <span>365 days</span>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Quiet Hours</span>
                <input
                  type="checkbox"
                  checked={settings.quietHours}
                  onChange={(e) => handleSettingChange('quietHours', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              
              {settings.quietHours && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={settings.quietStart}
                      onChange={(e) => handleSettingChange('quietStart', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={settings.quietEnd}
                      onChange={(e) => handleSettingChange('quietEnd', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <Icon name="AlertTriangle" className="text-yellow-400 mr-3" size={20} />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">System Maintenance</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    These settings affect the entire CCTV system. Changes may require system restart.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                variant="outline"
                fullWidth
                iconName="RefreshCw"
                onClick={() => {/* Restart service */}}
              >
                Restart CCTV Service
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Download"
                onClick={() => {/* Backup config */}}
              >
                Backup Configuration
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Upload"
                onClick={() => {/* Restore config */}}
              >
                Restore Configuration
              </Button>
              
              <Button
                variant="danger"
                fullWidth
                iconName="Power"
                onClick={() => {/* Reboot system */}}
              >
                Reboot System
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/cctv/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Back to CCTV Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">CCTV System Settings</h1>
          <p className="mt-2 text-gray-600">Configure surveillance system preferences and behavior</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label} Settings
                </h2>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {/* Reset to defaults */}}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {/* Save settings */}}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVSettings;