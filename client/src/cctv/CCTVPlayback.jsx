import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const CCTVPlayback = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600);
  const [recordings, setRecordings] = useState([]);

  // Sample recordings data
  useEffect(() => {
    const sampleRecordings = [
      { id: 1, camera: 'Main Entrance', startTime: '09:00', endTime: '09:30', date: '2024-01-20', duration: '30 min', motionEvents: 5 },
      { id: 2, camera: 'Parking Area', startTime: '10:15', endTime: '10:45', date: '2024-01-20', duration: '30 min', motionEvents: 12 },
      { id: 3, camera: 'Warehouse', startTime: '14:30', endTime: '15:30', date: '2024-01-20', duration: '60 min', motionEvents: 3 },
      { id: 4, camera: 'Loading Dock', startTime: '16:00', endTime: '16:20', date: '2024-01-20', duration: '20 min', motionEvents: 0 },
      { id: 5, camera: 'Office Hallway', startTime: '18:45', endTime: '19:15', date: '2024-01-20', duration: '30 min', motionEvents: 8 },
    ];
    setRecordings(sampleRecordings);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = e.target.value;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                onClick={() => navigate('/admin/cctv/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Back to Live View
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Recording Playback</h1>
              <p className="mt-2 text-gray-600">Review and analyze past recordings</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Cameras</option>
                  <option value="1">Main Entrance</option>
                  <option value="2">Parking Area</option>
                  <option value="3">Warehouse</option>
                  <option value="4">Loading Dock</option>
                  <option value="5">Office Hallway</option>
                  <option value="6">Equipment Room</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                {/* Simulated video playback */}
                <div
                  ref={videoRef}
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=1200&h=675&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Playback Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                    {/* Playback Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Timeline */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleTimeUpdate}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                        <div className="flex justify-between text-sm text-gray-300 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={handlePlayPause}
                            className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                          >
                            <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-white text-sm">Speed:</span>
                            {[0.5, 1, 2, 4].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`px-3 py-1 rounded text-sm ${
                                  playbackSpeed === speed
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => {/* Previous frame */}}
                            className="p-2 text-white hover:text-white/80"
                            title="Previous Frame"
                          >
                            <Icon name="SkipBack" size={20} />
                          </button>
                          <button
                            onClick={() => {/* Next frame */}}
                            className="p-2 text-white hover:text-white/80"
                            title="Next Frame"
                          >
                            <Icon name="SkipForward" size={20} />
                          </button>
                          <button
                            onClick={() => {/* Export clip */}}
                            className="p-2 text-white hover:text-white/80"
                            title="Export Clip"
                          >
                            <Icon name="Download" size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Overlay Info */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <div className="font-medium">Main Entrance • {selectedDate.toLocaleDateString()}</div>
                          <div className="text-sm text-gray-300">Recording: 09:00 - 09:30</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                            <Icon name="Activity" size={12} className="inline mr-1" />
                            5 Motion Events
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Timeline</h3>
              <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                {/* Timeline with events */}
                {[0.1, 0.3, 0.45, 0.6, 0.85].map((position, index) => (
                  <div
                    key={index}
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 cursor-pointer"
                    style={{ left: `${position * 100}%` }}
                    title={`Motion Event ${index + 1}`}
                  >
                    <div className="absolute top-full mt-2 text-xs text-gray-600 whitespace-nowrap">
                      {Math.floor(position * 30)}:00
                    </div>
                  </div>
                ))}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Recordings List */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Available Recordings</h3>
                <span className="text-sm text-gray-500">{recordings.length} recordings</span>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    onClick={() => {/* Load recording */}}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{recording.camera}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {recording.date} • {recording.startTime} - {recording.endTime}
                        </div>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {recording.duration}
                          </span>
                          {recording.motionEvents > 0 && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                              {recording.motionEvents} events
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 transition-all">
                        <Icon name="Play" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Export Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Export Options</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    fullWidth
                  >
                    Export Clip
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Image"
                    fullWidth
                  >
                    Save Snapshot
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVPlayback;