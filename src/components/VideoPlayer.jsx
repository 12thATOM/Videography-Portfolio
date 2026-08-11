import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Repeat } from 'lucide-react';
import { useMediaUrl } from '../hooks/useMediaUrl';

const isYouTubeOrVimeo = (url) =>
  url && (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com'));

export const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const { url: videoSrc, loading: videoLoading, error: mediaError } = useMediaUrl(video?.videoUrl);
  const { url: posterSrc } = useMediaUrl(video?.poster);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [durationTime, setDurationTime] = useState('00:00');
  const [isLooping, setIsLooping] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback failed:', err);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);
    setCurrentTime(formatTime(cur));
    setDurationTime(formatTime(dur));
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newProgress = parseFloat(e.target.value);
    const dur = videoRef.current.duration || 1;
    videoRef.current.currentTime = (newProgress / 100) * dur;
    setProgress(newProgress);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const toggleLoop = () => {
    if (videoRef.current) {
      videoRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const handleVideoError = (e) => {
    console.error('Video element error:', e);
    setHasError(true);
    setIsPlaying(false);
  };

  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('00:00');
    setDurationTime('00:00');
  }, [videoSrc, video?.videoUrl]);

  // Set volume when video loads
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [videoSrc, volume]);

  const rawUrl = video?.videoUrl || '';
  const isEmbed =
    video?.videoType === 'youtube' ||
    video?.videoType === 'vimeo' ||
    isYouTubeOrVimeo(rawUrl);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch')) {
        const id = new URL(url).searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
    } catch {
      return url;
    }
    return url;
  };

  const showError = hasError || mediaError;

  return (
    <div
      ref={containerRef}
      className="relative group w-full bg-black rounded-xl overflow-hidden border border-neutral-800 shadow-2xl aspect-video"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {isEmbed ? (
        <iframe
          src={getEmbedUrl(rawUrl)}
          title={video?.title || 'Video'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : videoLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-neutral-950">
          <div className="w-10 h-10 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
        </div>
      ) : showError || !videoSrc ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 gap-2 p-6">
          <span className="text-sm">Unable to load video</span>
          <span className="text-xs text-neutral-600 text-center">
            Supported formats: MP4, WebM, MOV, AVI, MKV, OGG
          </span>
        </div>
      ) : (
        <>
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc || undefined}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onCanPlay={() => setHasError(false)}
            onEnded={() => setIsPlaying(false)}
            onError={handleVideoError}
            onClick={togglePlay}
            muted={isMuted}
            playsInline
            preload="auto"
            className="w-full h-full object-contain cursor-pointer bg-black"
          />

          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity z-10"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transform hover:scale-110 transition-all shadow-2xl">
                <Play size={28} className="ml-1 fill-white sm:w-8 sm:h-8" />
              </div>
            </div>
          )}

          <div
            className={`absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-20 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative w-full flex items-center mb-2 sm:mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-700 hover:h-2 rounded-lg appearance-none cursor-pointer accent-white transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-neutral-200">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={togglePlay}
                  className="p-1.5 sm:p-2 hover:text-white transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="p-1 hover:text-white transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-12 sm:w-16 h-1 bg-neutral-700 rounded appearance-none cursor-pointer accent-white hidden sm:block"
                  />
                </div>

                <span className="text-[10px] sm:text-xs font-mono text-neutral-400">
                  {currentTime} / {durationTime}
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={toggleLoop}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    isLooping ? 'text-blue-400 bg-blue-950/60' : 'text-neutral-400 hover:text-white'
                  }`}
                  title={isLooping ? 'Looping Enabled' : 'Enable Loop'}
                >
                  <Repeat size={14} />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 sm:p-2 hover:text-white transition-colors"
                  title="Fullscreen"
                >
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
