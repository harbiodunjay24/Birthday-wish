import React from 'react';
import { Sun, Heart, Sparkles } from 'lucide-react';
import { StoryContent } from '../types';

interface FaithSectionProps {
  content: StoryContent;
}

export const FaithSection: React.FC<FaithSectionProps> = ({ content }) => {
  return (
    <section id="faith" className="relative py-28 px-4 sm:px-6 bg-gradient-to-b from-sky-50 via-purple-50/40 to-sky-50 overflow-hidden">
      {/* Background Soft Morning Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-sky-200/40 to-purple-200/40 blur-3xl" />
        <div className="absolute -top-10 right-10 w-64 h-64 rounded-full bg-amber-100/30 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Chapter Kicker */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50/80 px-3.5 py-1.5 rounded-full border border-purple-200/60 mb-3 shadow-2xs">
            <Sun className="w-3.5 h-3.5 text-purple-600" />
            <span>Chapter Three</span>
            <span aria-hidden="true">·</span>
            <span>Grace & Peace</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance mb-3">
            {content.faithTitle}
          </h2>

          <p className="font-serif-title text-xl text-sky-900/80 italic font-medium max-w-lg mx-auto">
            {content.faithSubtitle}
          </p>
        </div>

        {/* Serene Faith Card */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-sm shadow-purple-900/5">
          {/* Decorative Morning Light Element */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-100 to-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-8 shadow-inner">
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>

          {/* Faith Blessing Paragraphs */}
          <div className="space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed text-center font-sans">
            {content.faithParagraphs.map((para, index) => {
              const isFirst = index === 0;
              const isLast = index === content.faithParagraphs.length - 1;
              return (
                <p
                  key={index}
                  className={
                    isFirst
                      ? 'font-serif-title text-2xl sm:text-3xl text-slate-900 italic font-medium leading-snug'
                      : isLast
                      ? 'font-display font-semibold text-sky-950 pt-2'
                      : 'text-slate-600 leading-relaxed'
                  }
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* Subtle blessing seal */}
          <div className="mt-10 pt-6 border-t border-purple-100/60 flex items-center justify-center gap-2 text-xs text-purple-700/80 font-medium">
            <Heart className="w-3.5 h-3.5 text-purple-400" />
            <span>Prayers & blessings for your new year · 🩵</span>
          </div>
        </div>
      </div>
    </section>
  );
};
