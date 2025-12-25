import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const CCTVDashboard = () => {
  const navigate = useNavigate();
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraLayout, setCameraLayout] = useState('grid');
  const [videoQuality, setVideoQuality] = useState('hd');
  const [cameraStatus, setCameraStatus] = useState({
    online: 6,
    offline: 0,
    recording: 2
  });
  const [showMotionGrid, setShowMotionGrid] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMotion, setActiveMotion] = useState([]);
  const [cameraVolumes, setCameraVolumes] = useState({});
  const [cameraMuted, setCameraMuted] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [playbackRates, setPlaybackRates] = useState({});
  const [videoErrors, setVideoErrors] = useState({});
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedCameraDetails, setSelectedCameraDetails] = useState(null);

  const videoRefs = useRef([]);
  const systemTimeRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // High-quality CCTV video URLs
  const videoSources = useMemo(() => [
    "https://youtu.be/8qCVXCFREkQ?list=RD1K0moiDQNok",
    "https://assets.mixkit.co/videos/preview/mixkit-factory-workers-working-on-an-assembly-line-42931-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-construction-site-42933-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-walking-through-a-warehouse-42930-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-office-entrance-door-with-glass-partitions-42934-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-hallway-of-a-modern-office-42935-large.mp4"
  ], []);

  // Realistic camera data
  const cameras = useMemo(() => [
    {
      id: 1,
      name: 'Main Entrance',
      location: 'Front Gate',
      status: 'online',
      lastActive: 'Just now',
      resolution: '1080p',
      fps: 30,
      type: 'PTZ',
      hasAudio: true,
      hasRecording: true,
      hasNightVision: true,
      isRecording: true,
      motionDetected: true,
      coordinates: [28.7041, 77.1025],
      videoUrl: videoSources[0],
      liveColor: 'bg-red-500',
      audioEnabled: true,
      volume: 50,
      storageUsage: '45GB',
      bandwidth: '2.4 Mbps',
      temperature: '32°C',
      humidity: '65%'
    },
    {
      id: 2,
      name: 'Parking Area',
      location: 'North Parking',
      status: 'online',
      lastActive: '2 mins ago',
      resolution: '1080p',
      fps: 25,
      type: 'Fixed',
      hasAudio: true,
      hasRecording: true,
      hasNightVision: false,
      isRecording: false,
      motionDetected: true,
      coordinates: [28.7035, 77.1018],
      videoUrl: videoSources[1],
      liveColor: 'bg-blue-500',
      audioEnabled: false,
      volume: 30,
      storageUsage: '32GB',
      bandwidth: '1.8 Mbps',
      temperature: '30°C',
      humidity: '60%'
    },
    {
      id: 3,
      name: 'Warehouse',
      location: 'Storage Unit A',
      status: 'online',
      lastActive: 'Just now',
      resolution: '4K',
      fps: 30,
      type: '360°',
      hasAudio: true,
      hasRecording: true,
      hasNightVision: true,
      isRecording: true,
      motionDetected: false,
      coordinates: [28.7028, 77.1032],
      videoUrl: videoSources[2],
      liveColor: 'bg-green-500',
      audioEnabled: true,
      volume: 70,
      storageUsage: '78GB',
      bandwidth: '4.2 Mbps',
      temperature: '28°C',
      humidity: '55%'
    },
    {
      id: 4,
      name: 'Loading Dock',
      location: 'Back Entrance',
      status: 'online',
      lastActive: '5 mins ago',
      resolution: '720p',
      fps: 20,
      type: 'Fixed',
      hasAudio: false,
      hasRecording: false,
      hasNightVision: true,
      isRecording: false,
      motionDetected: false,
      coordinates: [28.7045, 77.1005],
      videoUrl: videoSources[3],
      liveColor: 'bg-yellow-500',
      audioEnabled: false,
      volume: 0,
      storageUsage: '15GB',
      bandwidth: '1.2 Mbps',
      temperature: '35°C',
      humidity: '70%'
    },
    {
      id: 5,
      name: 'Office Hallway',
      location: '2nd Floor',
      status: 'online',
      lastActive: 'Just now',
      resolution: '1080p',
      fps: 30,
      type: 'Dome',
      hasAudio: true,
      hasRecording: true,
      hasNightVision: false,
      isRecording: true,
      motionDetected: true,
      coordinates: [28.7032, 77.1021],
      videoUrl: videoSources[4],
      liveColor: 'bg-purple-500',
      audioEnabled: true,
      volume: 80,
      storageUsage: '56GB',
      bandwidth: '2.1 Mbps',
      temperature: '24°C',
      humidity: '50%'
    },
    {
      id: 6,
      name: 'Equipment Room',
      location: 'Basement',
      status: 'online',
      lastActive: '1 min ago',
      resolution: '1080p',
      fps: 15,
      type: 'Fixed',
      hasAudio: true,
      hasRecording: true,
      hasNightVision: true,
      isRecording: false,
      motionDetected: false,
      coordinates: [28.7048, 77.1012],
      videoUrl: videoSources[5],
      liveColor: 'bg-pink-500',
      audioEnabled: false,
      volume: 40,
      storageUsage: '29GB',
      bandwidth: '1.5 Mbps',
      temperature: '26°C',
      humidity: '45%'
    }
  ], [videoSources]);

  // Initialize camera states
  useEffect(() => {
    const initialVolumes = {};
    const initialMuted = {};
    const initialPlaybackRates = {};
    const initialLoading = {};
    
    cameras.forEach(camera => {
      initialVolumes[camera.id] = camera.volume;
      initialMuted[camera.id] = !camera.audioEnabled;
      initialPlaybackRates[camera.id] = 1.0;
      initialLoading[camera.id] = true;
    });
    
    setCameraVolumes(initialVolumes);
    setCameraMuted(initialMuted);
    setPlaybackRates(initialPlaybackRates);
    setLoadingStates(initialLoading);
  }, [cameras]);

  // Simulate motion detection
  useEffect(() => {
    let motionTimeout;
    
    const motionInterval = setInterval(() => {
      const randomCameraIndex = Math.floor(Math.random() * cameras.length);
      const randomDuration = 2000 + Math.random() * 3000;
      
      if (!activeMotion.includes(randomCameraIndex)) {
        setActiveMotion(prev => [...prev, randomCameraIndex]);
        
        if (cameras[randomCameraIndex]?.audioEnabled && !cameraMuted[cameras[randomCameraIndex].id]) {
          playAlertSound();
        }
        
        motionTimeout = setTimeout(() => {
          setActiveMotion(prev => prev.filter(cam => cam !== randomCameraIndex));
        }, randomDuration);
      }
    }, 8000);

    return () => {
      clearInterval(motionInterval);
      clearTimeout(motionTimeout);
    };
  }, [cameras, cameraMuted, activeMotion]);

  // System time update
  useEffect(() => {
    systemTimeRef.current = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    return () => {
      clearInterval(systemTimeRef.current);
    };
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingDuration(0);
    }

    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(systemTimeRef.current);
      clearInterval(recordingTimerRef.current);
    };
  }, []);

  // Play alert sound
  const playAlertSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 200);
      
      setIsAudioPlaying(true);
      setTimeout(() => setIsAudioPlaying(false), 200);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }, []);

  // Video controls
  const handlePlayPause = useCallback(() => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    videoRefs.current.forEach((video) => {
      if (video) {
        if (newPlayingState) {
          video.play().catch(e => console.log('Video play error:', e));
        } else {
          video.pause();
        }
      }
    });
  }, [isPlaying]);

  const handleRecord = useCallback(() => {
    const newRecordingState = !isRecording;
    setIsRecording(newRecordingState);
    
    if (newRecordingState) {
      console.log('Recording started');
    } else {
      console.log('Recording stopped');
    }
  }, [isRecording]);

  const handleCameraSelect = useCallback((index) => {
    setSelectedCamera(index);
    setSelectedCameraDetails(cameras[index]);
  }, [cameras]);

  const handleFullscreen = useCallback((cameraIndex = null) => {
    let elem;
    
    if (cameraIndex !== null && videoRefs.current[cameraIndex]) {
      elem = videoRefs.current[cameraIndex];
    } else {
      elem = document.documentElement;
    }
    
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().catch(err => {
        console.log(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const handleSnapshot = useCallback((cameraIndex) => {
    const video = videoRefs.current[cameraIndex];
    const camera = cameras[cameraIndex];
    
    if (!video || video.readyState < 2) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Add overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(camera.name, 20, canvas.height - 50);
    
    ctx.font = '16px Arial';
    const timeText = `${formatTime(systemTime)} | ${camera.resolution}`;
    ctx.fillText(timeText, canvas.width - ctx.measureText(timeText).width - 20, canvas.height - 30);
    
    const link = document.createElement('a');
    link.download = `snapshot-${camera.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [cameras, systemTime]);

  const handleCameraView = useCallback((cameraId) => {
    navigate(`/admin/cctv/camera/${cameraId}`);
  }, [navigate]);

  const handleVolumeChange = useCallback((cameraId, volume) => {
    setCameraVolumes(prev => ({
      ...prev,
      [cameraId]: volume
    }));
    
    const cameraIndex = cameras.findIndex(cam => cam.id === cameraId);
    if (videoRefs.current[cameraIndex]) {
      videoRefs.current[cameraIndex].volume = volume / 100;
    }
  }, [cameras]);

  const handleMuteToggle = useCallback((cameraId) => {
    setCameraMuted(prev => {
      const newMuted = !prev[cameraId];
      
      const cameraIndex = cameras.findIndex(cam => cam.id === cameraId);
      if (videoRefs.current[cameraIndex]) {
        videoRefs.current[cameraIndex].muted = newMuted;
      }
      
      return {
        ...prev,
        [cameraId]: newMuted
      };
    });
  }, [cameras]);

  const handlePlaybackRateChange = useCallback((cameraId, rate) => {
    setPlaybackRates(prev => ({
      ...prev,
      [cameraId]: rate
    }));
    
    const cameraIndex = cameras.findIndex(cam => cam.id === cameraId);
    if (videoRefs.current[cameraIndex]) {
      videoRefs.current[cameraIndex].playbackRate = rate;
    }
  }, [cameras]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'online': return 'bg-green-500 animate-pulse';
      case 'offline': return 'bg-red-500';
      case 'recording': return 'bg-blue-500 animate-pulse';
      default: return 'bg-gray-500';
    }
  }, []);

  const getLayoutClasses = useCallback(() => {
    switch (cameraLayout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'focus':
        return 'grid grid-cols-1 gap-4';
      case 'pip':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  }, [cameraLayout]);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, []);

  const formatDuration = useCallback((seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCameraStatus(prev => ({
        ...prev,
        online: Math.floor(Math.random() * 2) + 5,
        recording: Math.floor(Math.random() * 3)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoLoadStart = useCallback((cameraId) => {
    setLoadingStates(prev => ({ ...prev, [cameraId]: true }));
    setVideoErrors(prev => ({ ...prev, [cameraId]: false }));
  }, []);

  const handleVideoLoaded = useCallback((cameraId) => {
    setLoadingStates(prev => ({ ...prev, [cameraId]: false }));
  }, []);

  const handleVideoError = useCallback((cameraId) => {
    setLoadingStates(prev => ({ ...prev, [cameraId]: false }));
    setVideoErrors(prev => ({ ...prev, [cameraId]: true }));
  }, []);

  // Video Player Component
  const VideoPlayer = React.memo(({ camera, index }) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const controlsTimeoutRef = useRef(null);

    useEffect(() => {
      videoRefs.current[index] = videoRef.current;
      
      if (videoRef.current) {
        videoRef.current.volume = (cameraVolumes[camera.id] || 50) / 100;
        videoRef.current.muted = cameraMuted[camera.id] || false;
        videoRef.current.playbackRate = playbackRates[camera.id] || 1.0;
      }

      return () => {
        clearTimeout(controlsTimeoutRef.current);
      };
    }, [camera.id, index, cameraVolumes, cameraMuted, playbackRates]);

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleIndividualPlayPause = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(e => console.log('Video play error:', e));
        } else {
          videoRef.current.pause();
        }
      }
    };

    return (
      <div 
        className="relative w-full h-full overflow-hidden bg-black rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowControls(false);
          clearTimeout(controlsTimeoutRef.current);
        }}
        onMouseMove={handleMouseMove}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={camera.videoUrl}
          muted={cameraMuted[camera.id] || false}
          loop
          autoPlay={isPlaying}
          playsInline
          preload="metadata"
          onLoadStart={() => handleVideoLoadStart(camera.id)}
          onLoadedData={() => handleVideoLoaded(camera.id)}
          onError={() => handleVideoError(camera.id)}
        >
          Your browser does not support the video tag.
        </video>

        {loadingStates[camera.id] && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-400 text-sm">Loading feed...</p>
            </div>
          </div>
        )}

        {videoErrors[camera.id] && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={32} className="text-red-400" />
              </div>
              <p className="text-gray-300 font-semibold mb-2">Feed Unavailable</p>
              <button 
                onClick={() => setVideoErrors(prev => ({ ...prev, [camera.id]: false }))}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {showMotionGrid && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="grid grid-cols-8 grid-rows-6 h-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-700/50"></div>
              ))}
            </div>
          </div>
        )}

        {activeMotion.includes(index) && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-red-500 animate-ping"></div>
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
              MOTION DETECTED
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <span className="text-white text-sm font-mono">{formatTime(systemTime)}</span>
            </div>
            <div className="text-white text-xs font-mono bg-black/70 px-2 py-1 rounded">
              {camera.resolution} | {camera.fps} FPS
            </div>
          </div>
        </div>

        {camera.isRecording && (
          <div className="absolute top-12 right-3">
            <div className="flex items-center space-x-1 text-white text-xs bg-red-600 px-2 py-1 rounded animate-pulse shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>REC</span>
              <span className="font-mono">{formatDuration(recordingDuration)}</span>
            </div>
          </div>
        )}

        {(isHovered || showControls) && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleIndividualPlayPause}
                  className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors shadow-lg"
                  title={videoRef.current?.paused ? "Play" : "Pause"}
                >
                  <Icon name={videoRef.current?.paused ? "Play" : "Pause"} size={16} />
                </button>

                {camera.hasAudio && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMuteToggle(camera.id)}
                      className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors shadow-lg"
                      title={cameraMuted[camera.id] ? "Unmute" : "Mute"}
                    >
                      <Icon name={cameraMuted[camera.id] ? "VolumeX" : "Volume2"} size={16} />
                    </button>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cameraVolumes[camera.id] || 50}
                        onChange={(e) => handleVolumeChange(camera.id, parseInt(e.target.value))}
                        className="w-20 accent-blue-500 bg-gray-700 rounded-lg cursor-pointer"
                      />
                      <span className="text-white text-xs w-8">
                        {cameraVolumes[camera.id] || 50}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs">Speed:</span>
                  <select
                    value={playbackRates[camera.id] || 1}
                    onChange={(e) => handlePlaybackRateChange(camera.id, parseFloat(e.target.value))}
                    className="bg-black/70 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="0.25">0.25x</option>
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSnapshot(index)}
                  className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors shadow-lg"
                  title="Take Snapshot"
                >
                  <Icon name="Camera" size={16} />
                </button>

                <button
                  onClick={() => handleFullscreen(index)}
                  className="p-2 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-colors shadow-lg"
                  title="Fullscreen"
                >
                  <Icon name="Maximize2" size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-16 right-3 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs">
          <div className="text-gray-300 space-y-1">
            <div className="flex items-center">
              <Icon name="HardDrive" size={10} className="mr-1" />
              <span>{camera.storageUsage}</span>
            </div>
            <div className="flex items-center">
              <Icon name="Wifi" size={10} className="mr-1" />
              <span>{camera.bandwidth}</span>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="relative">
                  <Icon name="Video" size={32} className="text-blue-400 animate-pulse" />
                  <div className="absolute -inset-1 bg-blue-500/20 blur-sm rounded-full -z-10"></div>
                </div>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  CCTV Surveillance System
                </span>
              </h1>
              <p className="mt-2 text-gray-400">Real-time monitoring of all security cameras</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">System Time</div>
                  <div className="text-lg font-mono font-bold text-white bg-gray-800/80 px-3 py-1 rounded">
                    {systemTime.toLocaleTimeString()}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-700"></div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    <span className="text-sm text-gray-300">{cameraStatus.online} Online</span>
                  </div>
                  <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                    <span className="text-sm text-gray-300">{cameraStatus.offline} Offline</span>
                  </div>
                  <div className="flex items-center bg-gray-800/50 px-3 py-1 rounded">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    <span className="text-sm text-gray-300">{cameraStatus.recording} Recording</span>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                iconName="Settings"
                onClick={() => navigate('/admin/cctv/settings')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
              >
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant={isPlaying ? "primary" : "outline"}
                  size="sm"
                  iconName={isPlaying ? "Pause" : "Play"}
                  onClick={handlePlayPause}
                  className={isPlaying ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" : "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"}
                >
                  {isPlaying ? 'Pause All' : 'Play All'}
                </Button>
                
                <Button
                  variant={isRecording ? "danger" : "outline"}
                  size="sm"
                  iconName={isRecording ? "Square" : "Circle"}
                  onClick={handleRecord}
                  className={isRecording ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg animate-pulse" : "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"}
                >
                  {isRecording ? `Stop (${formatDuration(recordingDuration)})` : 'Record All'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Camera"
                  onClick={() => handleSnapshot(selectedCamera)}
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                >
                  Snapshot
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  iconName={showMotionGrid ? "Grid" : "Layout"}
                  onClick={() => setShowMotionGrid(!showMotionGrid)}
                  className={`border-gray-600 ${showMotionGrid ? 'text-blue-400 border-blue-500/50' : 'text-gray-300'}`}
                >
                  {showMotionGrid ? 'Hide Grid' : 'Show Grid'}
                </Button>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Layout:</span>
                <div className="flex space-x-1 bg-gray-900/70 p-1 rounded-lg border border-gray-700">
                  {[
                    { key: 'grid', icon: 'Grid', label: 'Grid' },
                    { key: 'focus', icon: 'Maximize2', label: 'Focus' },
                    { key: 'pip', icon: 'PictureInPicture', label: 'PIP' }
                  ].map((layout) => (
                    <button
                      key={layout.key}
                      onClick={() => setCameraLayout(layout.key)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                        cameraLayout === layout.key
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                      title={layout.label}
                    >
                      <Icon name={layout.icon} size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Quality:</span>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="rounded-lg border border-gray-700 bg-gray-900/70 text-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sd">SD (480p)</option>
                  <option value="hd">HD (720p)</option>
                  <option value="fullhd">Full HD (1080p)</option>
                  <option value="4k">4K</option>
                </select>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Camera Grid */}
        <div className={getLayoutClasses()}>
          {cameras.map((camera, index) => (
            <div
              key={camera.id}
              className={`bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 ${
                selectedCamera === index && cameraLayout === 'focus' ? 'col-span-full border-blue-500' : 
                selectedCamera === index && cameraLayout === 'pip' ? 'lg:col-span-1 border-blue-500/50' : 
                'border-gray-700/50 hover:border-gray-600/50'
              } ${
                activeMotion.includes(index) ? 'animate-pulse border-red-500' : ''
              }`}
              onClick={() => handleCameraSelect(index)}
            >
              {/* Camera Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-900/70 to-gray-800/70">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(camera.status)}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">{camera.name}</h3>
                      {activeMotion.includes(index) && (
                        <span className="px-2 py-0.5 bg-red-500/30 text-red-400 text-xs rounded-full animate-pulse border border-red-500/50">
                          <Icon name="Activity" size={10} className="inline mr-1" />
                          MOTION
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-sm text-gray-400 truncate">{camera.location}</p>
                      <span className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded border border-gray-600/50">
                        {camera.type}
                      </span>
                      {camera.hasAudio && (
                        <span className={`text-xs px-2 py-0.5 rounded border ${
                          cameraMuted[camera.id] 
                            ? 'bg-gray-700/50 text-gray-400 border-gray-600/50' 
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          <Icon name={cameraMuted[camera.id] ? "VolumeX" : "Volume2"} size={10} className="inline mr-1" />
                          {cameraMuted[camera.id] ? 'Muted' : `${cameraVolumes[camera.id] || 50}%`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {camera.hasAudio && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteToggle(camera.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        cameraMuted[camera.id]
                          ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      }`}
                      title={cameraMuted[camera.id] ? "Unmute" : "Mute"}
                    >
                      <Icon name={cameraMuted[camera.id] ? "VolumeX" : "Volume2"} size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCameraView(camera.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 rounded-lg transition-colors"
                    title="Full screen view"
                  >
                    <Icon name="Maximize2" size={16} />
                  </button>
                </div>
              </div>

              {/* Video Feed */}
              <div className="relative aspect-video">
                <VideoPlayer camera={camera} index={index} />
              </div>

              {/* Camera Footer */}
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Icon name="Clock" size={12} className="mr-1" />
                        {camera.lastActive}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Wifi" size={12} className="mr-1" />
                        {Math.floor(Math.random() * 30) + 70}%
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {camera.hasNightVision && (
                      <button className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50 rounded-lg transition-colors" title="Night Vision">
                        <Icon name="Moon" size={14} />
                      </button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-700/50 rounded-lg transition-colors" title="Camera Settings">
                      <Icon name="Settings" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Storage Status */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-xl shadow-lg p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Total Storage Used</p>
                <p className="text-2xl font-bold text-white mt-1">245.8 GB</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl">
                <Icon name="Database" size={24} className="text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>65% used</span>
                <span>378.2 GB free</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400 flex items-center">
              <Icon name="HardDrive" size={14} className="mr-2" />
              Last backup: Today 02:00 AM
            </div>
          </div>

          {/* Motion Detection */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-xl shadow-lg p-6 border border-gray-700/50 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Motion Detections</p>
                <p className="text-2xl font-bold text-white mt-1">1,247</p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl">
                <Icon name="Activity" size={24} className="text-green-400 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400 font-medium flex items-center">
                <Icon name="TrendingUp" size={14} className="mr-1" />
                ↑ 12%
              </span>
              <span className="text-gray-400 ml-2">from yesterday</span>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <div className="flex items-center justify-between">
                <span>Active alerts: {activeMotion.length}</span>
                <span className={`px-2 py-1 rounded ${activeMotion.length > 0 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-green-500/20 text-green-400'}`}>
                  {activeMotion.length > 0 ? 'ALERT' : 'Clear'}
                </span>
              </div>
            </div>
          </div>

          {/* System Uptime */}
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-xl shadow-lg p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">System Uptime</p>
                <p className="text-2xl font-bold text-white mt-1">99.8%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl">
                <Icon name="Server" size={24} className="text-purple-400" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400 flex items-center">
              <Icon name="Clock" size={14} className="mr-2" />
              Last restart: 14 days ago
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-400">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span>CPU Usage</span>
                    <span className="text-green-400">42%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="mt-8 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-xl shadow-lg p-6 border border-gray-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-blue-400" />
              Recording Timeline
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400 bg-gray-900/50 px-3 py-1 rounded">
                {systemTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                onClick={() => navigate('/admin/cctv/playback')}
                className="border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500/50"
              >
                View Playback
              </Button>
            </div>
          </div>
          <div className="relative h-20 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700/50">
            {/* Timeline visualization */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className="flex-1 border-r border-gray-800 relative group">
                  <div className="text-xs text-gray-500 text-center mt-1 font-mono">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {Math.random() > 0.3 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{
                        height: `${20 + Math.random() * 60}%`,
                        left: `${Math.random() * 10}%`,
                        right: `${Math.random() * 10}%`
                      }}
                    ></div>
                  )}
                  {Math.random() > 0.7 && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 group">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Current time indicator */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-red-600"
              style={{ left: `${(systemTime.getHours() * 60 + systemTime.getMinutes()) / (24 * 60) * 100}%` }}
            >
              <div className="absolute -top-2 -left-1.5 w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-gray-400 gap-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded mr-2"></div>
                Recordings
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded mr-2 animate-pulse"></div>
                Motion Events
              </span>
            </div>
            <div className="font-mono bg-gray-900/50 px-3 py-1 rounded">
              Current: {formatTime(systemTime)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <button 
            onClick={() => navigate('/admin/cctv/alerts')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Icon name="Bell" size={16} />
            <span>View Alerts ({activeMotion.length})</span>
          </button>
          <button 
            onClick={() => navigate('/admin/cctv/reports')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Icon name="FileText" size={16} />
            <span>Generate Report</span>
          </button>
          <button 
            onClick={() => navigate('/admin/cctv/export')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Icon name="Download" size={16} />
            <span>Export Footage</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CCTVDashboard;