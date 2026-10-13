import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';
import { musicPlayer } from '../utils/audio';

interface NavigationProps {
  activeSection: string;
  onOpenPersonalize: () => void;
  onScrollToSection: (sectionId: string) => void;
  hasStarted: boolean;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
}

const SECTIONS = [
  { id: 'opening', label: 'Opening' },
  { id: 'may-story', label: 'May 2026' },
  { id: 'personality', label: 'Tracy' },
  { id: 'faith', label: 'Faith' },
  { id: 'little-things', label: 'Notes' },
  { id: 'photos', label: 'Memories' },
  { id: 'wishes', label: 'Wishes' },
  { id: 'letter', label: 'Letter' },
  { id: 'finale', label: 'Celebrate' },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onOpenPersonalize,
  onScrollToSection,
  hasStarted,
  isMusicPlaying = false,
  onToggleMusic,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (winScroll / height) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMusicClick = () => {
    if (onToggleMusic) {
      onToggleMusic();
    }
  };

  return (
    <>
      {/* Scroll progress bar with sky & subtle lilac gradient */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-sky-100">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-purple-300 to-sky-300 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Top Navigation */}
      <header className="fixed top-3 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 pointer-events-auto bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-full border border-sky-100/90 shadow-sm transition-all">
          {/* Brand/Wordmark */}
          <button
            onClick={() => onScrollToSection('opening')}
            className="flex items-center gap-2 text-sm font-medium text-sky-950 hover:text-sky-600 transition-colors shrink-0"
          >
            <span className="font-display font-semibold tracking-tight">For Tracy Anne</span>
            <span className="text-sky-400">🩵</span>
          </button>

          {/* Chapters (shown when story opened) */}
          {hasStarted ? (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-500 overflow-x-auto no-scrollbar">
              {SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => onScrollToSection(sec.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                      isActive
                        ? 'text-sky-700 bg-sky-50 font-semibold shadow-2xs'
                        : 'hover:text-sky-700 hover:bg-sky-50/50'
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="text-xs text-sky-700/80 font-medium hidden sm:block">
              A birthday story crafted with care
            </div>
          )}

          {/* Right Action controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Music Button */}
            <button
              onClick={handleMusicClick}
              title={isMusicPlaying ? 'Pause music' : 'Play Tracy’s birthday song'}
              aria-label={isMusicPlaying ? 'Pause music' : 'Play Tracy’s birthday song'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isMusicPlaying
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                  : 'bg-white text-slate-600 border-sky-200 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden xs:inline">Playing</span>
                  <span className="flex gap-0.5 items-end h-2.5">
                    <span className="w-0.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden xs:inline">Music</span>
                </>
              )}
            </button>

            {/* Personalize Button */}
            <button
              onClick={onOpenPersonalize}
              title="Personalize Tracy’s memories and photos"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100 hover:border-sky-300 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden md:inline">Edit Memories</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
