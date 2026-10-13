import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { CloudShape1, CloudShape2, StarIcon, SoftHeartIcon } from './SkyDecorations';
import { StoryContent } from '../types';

interface OpeningSectionProps {
  content: StoryContent;
  onOpen: () => void;
  hasStarted: boolean;
}

export const OpeningSection: React.FC<OpeningSectionProps> = ({
  content,
  onOpen,
  hasStarted,
}) => {
  return (
    <section
      id="opening"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-sky-50 pt-20 pb-16"
    >
      {/* Background Decorative Clouds & Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft floating clouds */}
        <div className="absolute -top-10 -left-20 text-white/75 w-80 sm:w-96 animate-pulse" style={{ animationDuration: '9s' }}>
          <CloudShape1 className="w-full h-auto filter drop-shadow-xs" />
        </div>
        <div className="absolute top-1/4 -right-16 text-white/65 w-72 sm:w-92 animate-pulse" style={{ animationDuration: '11s' }}>
          <CloudShape2 className="w-full h-auto filter drop-shadow-xs" />
        </div>
        <div className="absolute bottom-20 -left-12 text-white/60 w-64 sm:w-80">
          <CloudShape2 className="w-full h-auto filter drop-shadow-xs" />
        </div>
        <div className="absolute top-2/3 right-1/4 text-purple-100/50 w-48 sm:w-60">
          <CloudShape1 className="w-full h-auto" />
        </div>

        {/* Delicate Twinkling Stars */}
        <div className="absolute top-20 left-1/4 text-sky-400/90 animate-ping" style={{ animationDuration: '4s' }}>
          <StarIcon className="w-4 h-4" />
        </div>
        <div className="absolute top-32 right-1/4 text-purple-300/80 animate-ping" style={{ animationDuration: '5s' }}>
          <StarIcon className="w-3.5 h-3.5" />
        </div>
        <div className="absolute top-1/3 left-10 text-amber-200/90 animate-pulse" style={{ animationDuration: '3.5s' }}>
          <StarIcon className="w-4 h-4" />
        </div>
        <div className="absolute bottom-1/3 right-10 text-sky-400/80 animate-pulse" style={{ animationDuration: '4.5s' }}>
          <StarIcon className="w-5 h-5" />
        </div>

        {/* Subtle Lilac & Sky Floating Hearts */}
        <div className="absolute top-1/2 left-12 text-purple-300/40 animate-bounce" style={{ animationDuration: '7s' }}>
          <SoftHeartIcon className="w-5 h-5" />
        </div>
        <div className="absolute top-24 right-16 text-sky-300/50 animate-bounce" style={{ animationDuration: '6s' }}>
          <SoftHeartIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Content Presentation */}
      <div className="relative z-10 max-w-xl w-full text-center mx-auto flex flex-col items-center">
        {/* Subtle decorative tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-sky-100 text-sky-800 text-xs font-medium mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>A personal birthday story</span>
          <span className="text-purple-300">·</span>
          <span className="text-purple-700">For Tracy Anne</span>
        </div>

        {/* Prominent Name Greeting */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 text-balance mb-2 leading-tight">
          {content.openingTag}
        </h1>

        {/* Subheading */}
        <h2 className="font-serif-title text-2xl sm:text-3xl text-sky-900 italic font-medium mb-6">
          {content.openingSubheading}
        </h2>

        {/* Thoughtful Lead Copy */}
        <div className="space-y-4 max-w-lg mx-auto mb-10 text-slate-700 text-base sm:text-lg leading-relaxed font-sans">
          <p className="text-slate-600 font-normal">
            {content.openingMessage1}
          </p>
          <p className="text-slate-700 font-medium">
            {content.openingMessage2}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpen}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span className="tracking-wide">{content.openButtonText}</span>
          <span className="text-lg group-hover:translate-x-1 transition-transform">✨</span>
        </button>

        {/* Scroll hint if opened */}
        {hasStarted && (
          <div className="mt-12 flex flex-col items-center gap-2 text-sky-700/70 text-xs font-medium animate-bounce">
            <span>Scroll down to begin Chapter One</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Cloud Bottom Blend */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sky-50 to-transparent pointer-events-none" />
    </section>
  );
};
