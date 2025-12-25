import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const CameraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [ptz, setPtz] = useState({ pan: 0, tilt: 0, zoom: 1 });
  const [showControls, setShowControls] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingHistory, setRecordingHistory] = useState([]);

  // Sample camera data
  const cameras = {
    1: {
      id: 1,
      name: 'Main Entrance',
      location: 'Front Gate',
      status: 'online',
      ipAddress: '192.168.1.101',
      model: 'Hikvision DS-2CD2343G0-I',
      resolution: '1080p',
      fps: 30,
      type: 'PTZ',
      hasAudio: true,
      hasNightVision: true,
      hasMotionDetection: true,
      lastMotion: '2 minutes ago',
      storageUsed: '45.2 GB',
      uptime: '15 days 6 hours',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    2: {
      id: 2,
      name: 'Parking Area',
      location: 'North Parking',
      status: 'online',
      ipAddress: '192.168.1.102',
      model: 'Dahua IPC-HDW5831R-ZE',
      resolution: '1080p',
      fps: 25,
      type: 'Fixed',
      hasAudio: false,
      hasNightVision: true,
      hasMotionDetection: true,
      lastMotion: '15 minutes ago',
      storageUsed: '32.7 GB',
      uptime: '12 days 3 hours',
      coordinates: { lat: 40.7138, lng: -74.0070 }
    },
    3: {
      id: 3,
      name: 'Warehouse',
      location: 'Storage Unit A',
      status: 'online',
      ipAddress: '192.168.1.103',
      model: 'Axis P1448-LE',
      resolution: '4K',
      fps: 30,
      type: '360°',
      hasAudio: true,
      hasNightVision: false,
      hasMotionDetection: true,
      lastMotion: 'Just now',
      storageUsed: '67.8 GB',
      uptime: '21 days 8 hours',
      coordinates: { lat: 40.7148, lng: -74.0080 }
    },
    4: {
      id: 4,
      name: 'Loading Dock',
      location: 'Back Entrance',
      status: 'online',
      ipAddress: '192.168.1.104',
      model: 'Sony SNC-VB770',
      resolution: '720p',
      fps: 20,
      type: 'Fixed',
      hasAudio: false,
      hasNightVision: true,
      hasMotionDetection: false,
      lastMotion: 'Never',
      storageUsed: '12.3 GB',
      uptime: '8 days 12 hours',
      coordinates: { lat: 40.7158, lng: -74.0090 }
    },
    5: {
      id: 5,
      name: 'Office Hallway',
      location: '2nd Floor',
      status: 'online',
      ipAddress: '192.168.1.105',
      model: 'Bosch MIC IP starlight 7000',
      resolution: '1080p',
      fps: 30,
      type: 'Dome',
      hasAudio: true,
      hasNightVision: true,
      hasMotionDetection: true,
      lastMotion: '5 minutes ago',
      storageUsed: '28.9 GB',
      uptime: '18 days 2 hours',
      coordinates: { lat: 40.7168, lng: -74.0100 }
    },
    6: {
      id: 6,
      name: 'Equipment Room',
      location: 'Basement',
      status: 'online',
      ipAddress: '192.168.1.106',
      model: 'Honeywell HC36WPTZ7M',
      resolution: '1080p',
      fps: 15,
      type: 'Fixed',
      hasAudio: false,
      hasNightVision: true,
      hasMotionDetection: true,
      lastMotion: '1 hour ago',
      storageUsed: '15.6 GB',
      uptime: '6 days 9 hours',
      coordinates: { lat: 40.7178, lng: -74.0110 }
    }
  };

  useEffect(() => {
    setCamera(cameras[id] || cameras[1]);
    
    // Simulate recording time
    const interval = setInterval(() => {
      if (isRecording) {
        setRecordingTime(prev => prev + 1);
      }
    }, 1000);

    // Auto-hide controls
    const hideTimer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [id, isRecording]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleRecord = useCallback(() => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
    }
  }, [isRecording]);

  const handleFullscreen = useCallback(() => {
    const elem = videoRef.current;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleSnapshot = useCallback(() => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const link = document.createElement('a');
      link.download = `snapshot-${camera.name}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }, [camera]);

  const handlePTZControl = useCallback((direction) => {
    setPtz(prev => {
      const step = 5;
      switch (direction) {
        case 'up':
          return { ...prev, tilt: Math.min(prev.tilt + step, 90) };
        case 'down':
          return { ...prev, tilt: Math.max(prev.tilt - step, -90) };
        case 'left':
          return { ...prev, pan: Math.max(prev.pan - step, -180) };
        case 'right':
          return { ...prev, pan: Math.min(prev.pan + step, 180) };
        case 'zoomIn':
          return { ...prev, zoom: Math.min(prev.zoom * 1.2, 10) };
        case 'zoomOut':
          return { ...prev, zoom: Math.max(prev.zoom / 1.2, 1) };
        default:
          return prev;
      }
    });
  }, []);

  const handleResetPTZ = useCallback(() => {
    setPtz({ pan: 0, tilt: 0, zoom: 1 });
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!camera) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading camera feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/cctv')}
                className="flex items-center text-gray-300 hover:text-white transition-colors mb-2"
              >
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Back to All Cameras
              </button>
              <h1 className="text-2xl font-bold text-white">{camera.name}</h1>
              <p className="text-gray-400">{camera.location}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-2"></span>
                <span className="text-green-400 text-sm">LIVE</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                onClick={() => navigate(`/camera/${id}/settings`)}
              >
                Camera Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <div 
              className="relative bg-black rounded-xl overflow-hidden shadow-2xl"
              onMouseMove={() => setShowControls(true)}
              onMouseLeave={() => setTimeout(() => setShowControls(false), 3000)}
            >
              {/* Video Feed */}
              <div 
                ref={videoRef}
                className="w-full aspect-video bg-gradient-to-br from-gray-900 to-black"
                style={{
                  transform: `scale(${zoom})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`
                }}
              >
                {/* Simulated video with grid overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white/20 mb-4">
                      {camera.name}
                    </div>
                    <div className="text-lg text-white/30">
                      {camera.resolution} • {camera.fps} FPS
                    </div>
                    <div className="mt-8 text-sm text-white/20">
                      Simulated CCTV Feed
                    </div>
                  </div>
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-white/5"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Overlay Controls */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-white text-sm">LIVE • {camera.ipAddress}</span>
                      </div>
                      {isRecording && (
                        <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          <span className="text-white text-sm font-medium">
                            REC • {formatTime(recordingTime)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                        {camera.resolution}
                      </div>
                      <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                        {camera.fps} FPS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center PTZ Controls (for PTZ cameras) */}
                {camera.type === 'PTZ' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handlePTZControl('up')}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="ChevronUp" size={24} />
                      </button>
                      <div></div>
                      <button
                        onClick={() => handlePTZControl('zoomIn')}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="ZoomIn" size={24} />
                      </button>
                      <button
                        onClick={() => handlePTZControl('left')}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="ChevronLeft" size={24} />
                      </button>
                      <button
                        onClick={handleResetPTZ}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="Target" size={24} />
                      </button>
                      <button
                        onClick={() => handlePTZControl('right')}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="ChevronRight" size={24} />
                      </button>
                      <div></div>
                      <button
                        onClick={() => handlePTZControl('down')}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="ChevronDown" size={24} />
                      </button>
                      <button
                        onClick={() => handlePTZControl('zoomOut')}
                        className="p-4 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                      >
                        <Icon name="ZoomOut" size={24} />
                      </button>
                    </div>
                    <div className="mt-4 text-center text-white/60 text-sm">
                      Pan: {ptz.pan}° • Tilt: {ptz.tilt}° • Zoom: {ptz.zoom.toFixed(1)}x
                    </div>
                  </div>
                )}

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                      >
                        <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                      </button>
                      
                      <button
                        onClick={handleRecord}
                        className={`p-3 rounded-full transition-colors backdrop-blur-sm ${
                          isRecording
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Icon name={isRecording ? "Square" : "Circle"} size={20} />
                      </button>
                      
                      <button
                        onClick={handleSnapshot}
                        className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                      >
                        <Icon name="Camera" size={20} />
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setMuted(!muted)}
                          className="p-2 text-white hover:text-white/80 transition-colors"
                        >
                          <Icon name={muted ? "VolumeX" : "Volume2"} size={20} />
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="w-24 accent-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="ZoomIn" size={16} className="text-white" />
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.1"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="w-24 accent-white"
                        />
                        <Icon name="ZoomOut" size={16} className="text-white" />
                      </div>
                      
                      <button
                        onClick={handleFullscreen}
                        className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                      >
                        <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <label className="text-sm text-gray-400 mb-2 block">Brightness</label>
                <div className="flex items-center space-x-3">
                  <Icon name="Sun" size={16} className="text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-white text-sm w-10">{brightness}%</span>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <label className="text-sm text-gray-400 mb-2 block">Contrast</label>
                <div className="flex items-center space-x-3">
                  <Icon name="Contrast" size={16} className="text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-white text-sm w-10">{contrast}%</span>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <label className="text-sm text-gray-400 mb-2 block">Presets</label>
                <div className="flex space-x-2">
                  {['Entrance', 'Overview', 'Night'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setBrightness(preset === 'Night' ? 30 : 50);
                        setContrast(preset === 'Night' ? 70 : 50);
                      }}
                      className="flex-1 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Camera Info */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Camera Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Model</span>
                  <span className="text-white">{camera.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address</span>
                  <span className="text-white font-mono">{camera.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">{camera.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Used</span>
                  <span className="text-white">{camera.storageUsed}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-white mb-3">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {camera.hasAudio && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      <Icon name="Mic" size={12} className="inline mr-1" />
                      Audio
                    </span>
                  )}
                  {camera.hasNightVision && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      <Icon name="Moon" size={12} className="inline mr-1" />
                      Night Vision
                    </span>
                  )}
                  {camera.hasMotionDetection && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                      <Icon name="Activity" size={12} className="inline mr-1" />
                      Motion Detection
                    </span>
                  )}
                  {camera.type === 'PTZ' && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                      <Icon name="Navigation" size={12} className="inline mr-1" />
                      PTZ Controls
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Motion History */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Motion History</h3>
                <span className="text-sm text-gray-400">
                  Last: {camera.lastMotion}
                </span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="text-white text-sm">Motion Detected</div>
                        <div className="text-gray-400 text-xs">2 minutes ago</div>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      <Icon name="Play" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-center text-gray-400 hover:text-white text-sm border border-gray-700 rounded-lg transition-colors">
                View All Events
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate(`/camera/${id}/playback`)}
                  className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex flex-col items-center"
                >
                  <Icon name="PlayCircle" size={20} className="mb-2" />
                  <span className="text-sm">Playback</span>
                </button>
                <button
                  onClick={() => navigate(`/camera/${id}/recordings`)}
                  className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex flex-col items-center"
                >
                  <Icon name="Video" size={20} className="mb-2" />
                  <span className="text-sm">Recordings</span>
                </button>
                <button
                  onClick={() => navigate(`/camera/${id}/snapshots`)}
                  className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex flex-col items-center"
                >
                  <Icon name="Image" size={20} className="mb-2" />
                  <span className="text-sm">Snapshots</span>
                </button>
                <button
                  onClick={() => navigate(`/camera/${id}/analytics`)}
                  className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex flex-col items-center"
                >
                  <Icon name="BarChart" size={20} className="mb-2" />
                  <span className="text-sm">Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;