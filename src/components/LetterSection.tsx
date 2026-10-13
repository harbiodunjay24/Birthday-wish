import React from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { StoryContent } from '../types';

interface LetterSectionProps {
  content: StoryContent;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ content }) => {
  return (
    <section id="letter" className="relative py-28 px-4 sm:px-6 bg-gradient-to-b from-sky-100 via-sky-200/50 to-purple-100/40 overflow-hidden">
      {/* Background Soft Sky & Lilac Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-white/45 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-purple-200/40 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3">
            <Mail className="w-3.5 h-3.5 text-sky-600" />
            <span>Chapter Seven</span>
            <span aria-hidden="true">·</span>
            <span>A Personal Letter</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance">
            {content.letter.title}
          </h2>
        </div>

        {/* The Letter Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-14 shadow-xl shadow-sky-900/10 border border-sky-100/90 transform hover:-translate-y-0.5 transition-transform duration-300">
          {/* Wax Seal Stamp at Top Right */}
          <div className="absolute -top-5 right-8 sm:right-12 w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 via-sky-400 to-purple-400 shadow-md flex items-center justify-center text-white text-lg border-2 border-white ring-2 ring-sky-200/50">
            <span>🩵</span>
          </div>

          {/* Letter Header */}
          <div className="pb-6 mb-8 border-b border-sky-100">
            <div className="flex items-center justify-between text-xs text-sky-700 font-medium">
              <span className="font-display tracking-wider uppercase">
                {content.letter.salutation || 'Hey Tracy,'}
              </span>
              <span className="text-purple-600 font-serif-title italic text-sm">
                For Tracy Anne
              </span>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-5 text-slate-700 text-base sm:text-lg leading-relaxed font-sans">
            {content.letter.paragraphs.map((para, index) => {
              const isFirst = index === 0;
              const isSecondToLast = index === content.letter.paragraphs.length - 2;
              return (
                <p
                  key={index}
                  className={
                    isFirst
                      ? 'font-serif-title text-xl sm:text-2xl text-slate-900 italic leading-snug'
                      : isSecondToLast
                      ? 'font-display font-semibold text-sky-900 text-lg sm:text-xl'
                      : ''
                  }
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* Letter Sign-off */}
          <div className="mt-10 pt-8 border-t border-sky-100 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Warmest Wishes
              </div>
              <p className="font-handwriting text-2xl sm:text-3xl text-sky-800 leading-tight">
                {content.letter.signoff}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-sky-700 font-medium bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Happy Birthday Tracy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
