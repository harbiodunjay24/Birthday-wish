import React from 'react';
import { MessageCircle, Smile, Sparkles, HeartHandshake } from 'lucide-react';
import { StoryContent } from '../types';

interface LittleThingsSectionProps {
  content: StoryContent;
}

export const LittleThingsSection: React.FC<LittleThingsSectionProps> = ({ content }) => {
  return (
    <section id="little-things" className="relative py-24 px-4 sm:px-6 bg-sky-50/60 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-3">
            <span>Chapter Four</span>
            <span aria-hidden="true">·</span>
            <span>Moments That Matter</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance mb-6">
            {content.littleThingsTitle}
          </h2>
          <p className="font-serif-title text-xl sm:text-2xl text-sky-950 italic font-medium leading-snug">
            “{content.littleThingsIntro}”
          </p>
        </div>

        {/* Story Cards */}
        <div className="space-y-6">
          {content.littleThingsCards.map((card, index) => (
            <div
              key={card.id}
              className="group bg-white rounded-3xl p-8 sm:p-10 border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0 border border-sky-100 group-hover:bg-sky-100/80 transition-colors">
                  {index === 0 ? (
                    <HeartHandshake className="w-5 h-5 text-sky-600" />
                  ) : index === 1 ? (
                    <Smile className="w-5 h-5 text-sky-600" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-sky-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                      {card.tag}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">Memory Note 0{index + 1}</span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-800 leading-snug mb-2">
                    {card.text}
                  </h3>

                  {card.reflection && (
                    <p className="text-slate-600 text-sm sm:text-base font-sans leading-relaxed">
                      {card.reflection}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
