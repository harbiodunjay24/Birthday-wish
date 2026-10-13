import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Volume2, VolumeX, Play, Pause, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
  isReady: boolean;
}

interface YouTubeMusicPlayerProps {
  videoId?: string;
  onStateChange?: (isPlaying: boolean) => void;
}

// Extend Window interface for YT
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  getPlayerState: () => number;
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
}

export const YouTubeMusicPlayer = forwardRef<YouTubePlayerHandle, YouTubeMusicPlayerProps>(
  ({ videoId = '-vSn-pRUFM8', onStateChange }, ref) => {
    const playerRef = useRef<YTPlayerInstance | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [userHasAttemptedPlay, setUserHasAttemptedPlay] = useState(false);

    // Initialize YouTube Iframe Player API once
    useEffect(() => {
      let isMounted = true;

      const initPlayer = () => {
        if (!window.YT || !window.YT.Player) return;
        if (playerRef.current) return;

        try {
          playerRef.current = new window.YT.Player('persistent-yt-player-target', {
            videoId,
            playerVars: {
              autoplay: 0,
              controls: 1,
              modestbranding: 1,
              rel: 0,
              playsinline: 1,
              enablejsapi: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: () => {
                if (!isMounted) return;
                setIsReady(true);
                setErrorMessage(null);
              },
              onStateChange: (event) => {
                if (!isMounted) return;
                const state = event.data;
                const playing = state === window.YT.PlayerState.PLAYING;
                const buffering = state === window.YT.PlayerState.BUFFERING;

                setIsPlaying(playing);
                setIsBuffering(buffering);
                onStateChange?.(playing);

                if (playing) {
                  setErrorMessage(null);
                }
              },
              onError: (event) => {
                if (!isMounted) return;
                console.warn('YouTube Player Error:', event.data);
                let msg = 'Playback error';
                if (event.data === 150 || event.data === 101) {
                  msg = 'Video embedding restricted by owner';
                } else if (event.data === 2) {
                  msg = 'Invalid video parameters';
                }
                setErrorMessage(msg);
                setIsPlaying(false);
                onStateChange?.(false);
              },
            },
          });
        } catch (err) {
          console.error('Failed to create YouTube player instance', err);
        }
      };

      // Load YouTube API script if not loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
          if (isMounted) initPlayer();
        };
      } else {
        initPlayer();
      }

      return () => {
        isMounted = false;
        // Do not destroy player unless whole app unmounts
      };
    }, [videoId, onStateChange]);

    const play = () => {
      setUserHasAttemptedPlay(true);
      if (playerRef.current && isReady) {
        try {
          playerRef.current.playVideo();
        } catch (err) {
          console.warn('playVideo failed', err);
        }
      } else {
        // Retry when ready
        const timer = setInterval(() => {
          if (playerRef.current && isReady) {
            try {
              playerRef.current.playVideo();
            } catch {
              // ignore
            }
            clearInterval(timer);
          }
        }, 300);
        setTimeout(() => clearInterval(timer), 5000);
      }
    };

    const pause = () => {
      if (playerRef.current) {
        try {
          playerRef.current.pauseVideo();
        } catch (err) {
          console.warn('pauseVideo failed', err);
        }
      }
    };

    const toggle = () => {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    };

    useImperativeHandle(ref, () => ({
      play,
      pause,
      toggle,
      isPlaying,
      isReady,
    }));

    return (
      <aside
        ref={containerRef}
        aria-label="Birthday Soundtrack Player"
        className="fixed bottom-4 right-4 z-40 transition-all duration-300"
      >
        <div
          className={`bg-white/95 backdrop-blur-md rounded-2xl border border-sky-100 shadow-xl overflow-hidden transition-all duration-300 ${
            isMinimized ? 'w-auto' : 'w-72 sm:w-80'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-sky-50 via-purple-50/50 to-sky-50 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 truncate">
                Tracy’s Birthday Song 🩵
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggle}
                className="p-1 rounded-full text-sky-600 hover:bg-sky-100 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title={isMinimized ? 'Expand player' : 'Minimize player'}
                aria-label={isMinimized ? 'Expand player' : 'Minimize player'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Compliant YouTube Player Viewport (Kept in DOM so audio never stops) */}
          <div className={`${isMinimized ? 'hidden' : 'block'} p-3 space-y-2`}>
            {/* The actual YouTube iframe target (Official minimum sizing for compliance) */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner relative">
              <div
                id="persistent-yt-player-target"
                className="w-full h-full"
              />
            </div>

            {/* Status Information & Fallback Controls */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                {isBuffering ? (
                  <span className="text-sky-600 animate-pulse">Buffering audio...</span>
                ) : isPlaying ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Now Playing
                  </span>
                ) : (
                  <span>Music paused</span>
                )}
              </span>

              {/* Direct Tap to Play Action */}
              {!isPlaying && (
                <button
                  onClick={play}
                  className="px-2.5 py-1 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{userHasAttemptedPlay ? 'Resume' : 'Play Music'}</span>
                </button>
              )}
            </div>

            {/* Error Message Notice if any */}
            {errorMessage && (
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{errorMessage}. You can tap Play above to retry.</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    );
  }
);
