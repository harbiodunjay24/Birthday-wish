import React from 'react';
import { Compass, Utensils, Coffee, Rocket } from 'lucide-react';
import { StoryContent, PersonalityCard } from '../types';

interface PersonalitySectionProps {
  content: StoryContent;
}

export const PersonalitySection: React.FC<PersonalitySectionProps> = ({ content }) => {
  const getCardIcon = (icon: PersonalityCard['icon']) => {
    switch (icon) {
      case 'globe':
        return <Compass className="w-6 h-6 text-sky-600" />;
      case 'utensils':
        return <Utensils className="w-6 h-6 text-sky-600" />;
      case 'coffee':
        return <Coffee className="w-6 h-6 text-purple-600" />;
      case 'rocket':
      default:
        return <Rocket className="w-6 h-6 text-sky-600" />;
    }
  };

  const getAccentStyles = (accent: PersonalityCard['accent']) => {
    switch (accent) {
      case 'lilac':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
          iconBg: 'bg-purple-100/70',
          border: 'border-purple-100 hover:border-purple-200',
        };
      case 'baby-blue':
        return {
          badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
          iconBg: 'bg-sky-100/70',
          border: 'border-sky-100 hover:border-sky-200',
        };
      case 'sky':
      default:
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
          iconBg: 'bg-sky-100/80',
          border: 'border-sky-100 hover:border-sky-200',
        };
    }
  };

  return (
    <section id="personality" className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-sky-50 via-white to-sky-50 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-3">
            <span>Chapter Two</span>
            <span aria-hidden="true">·</span>
            <span>The Little Details</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance mb-4">
            A Little About the Girl Behind the Smile
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            The passions, plans, and little quirks you’ve shared in our conversations that make you who you are.
          </p>
        </div>

        {/* 4 Thematic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.personalityCards.map((card) => {
            const styles = getAccentStyles(card.accent);
            return (
              <div
                key={card.id}
                className={`group bg-white rounded-3xl p-8 border ${styles.border} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${styles.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                      {getCardIcon(card.icon)}
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${styles.badge}`}>
                      {card.tag}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-tight">
                    {card.title}
                  </h3>

                  {/* Highlight Quote */}
                  <div className="font-serif-title text-lg sm:text-xl text-sky-950 italic font-medium mb-4 leading-snug">
                    {card.quote}
                  </div>

                  {/* Detailed Prose */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
                    {card.details}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Tracy’s World</span>
                  <span className="text-sky-500 font-medium">🩵</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
