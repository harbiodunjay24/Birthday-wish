import React from 'react';
import {
  TrendingUp,
  Heart,
  Users,
  Plane,
  UtensilsCrossed,
  Sparkles,
  Trophy,
  Smile,
} from 'lucide-react';
import { WishItem } from '../types';

interface WishesSectionProps {
  wishes: WishItem[];
}

export const WishesSection: React.FC<WishesSectionProps> = ({ wishes }) => {
  const getWishIcon = (icon: WishItem['icon']) => {
    switch (icon) {
      case 'business':
        return <TrendingUp className="w-5 h-5 text-sky-600" />;
      case 'peace':
        return <Heart className="w-5 h-5 text-purple-600" />;
      case 'friendship':
        return <Users className="w-5 h-5 text-sky-600" />;
      case 'travel':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'food':
        return <UtensilsCrossed className="w-5 h-5 text-sky-600" />;
      case 'faith':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'joy':
        return <Trophy className="w-5 h-5 text-sky-600" />;
      case 'smile':
      default:
        return <Smile className="w-5 h-5 text-purple-600" />;
    }
  };

  const getAccentClass = (accent: WishItem['accent']) => {
    switch (accent) {
      case 'lilac':
        return {
          bg: 'bg-purple-50/70 hover:bg-purple-50',
          border: 'border-purple-200/80',
          iconBg: 'bg-purple-100/80',
          num: 'text-purple-500',
        };
      case 'baby-blue':
        return {
          bg: 'bg-sky-50/60 hover:bg-sky-50',
          border: 'border-sky-200/80',
          iconBg: 'bg-sky-100/70',
          num: 'text-sky-500',
        };
      case 'sky':
      default:
        return {
          bg: 'bg-white hover:bg-sky-50/40',
          border: 'border-sky-100',
          iconBg: 'bg-sky-100/80',
          num: 'text-sky-600',
        };
    }
  };

  return (
    <section id="wishes" className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-sky-50 via-purple-50/20 to-sky-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200/60 mb-3">
            <span>Chapter Six</span>
            <span aria-hidden="true">·</span>
            <span>Birthday Hopes</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance mb-4">
            Things I Wish for You
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            As you celebrate another year of life, here are eight genuine hopes for your journey ahead.
          </p>
        </div>

        {/* 8 Wishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {wishes.map((wish, index) => {
            const styles = getAccentClass(wish.accent);
            return (
              <div
                key={wish.id}
                className={`p-6 sm:p-7 rounded-3xl ${styles.bg} border ${styles.border} shadow-2xs hover:shadow-sm transition-all duration-300 flex items-start gap-4`}
              >
                <div className={`w-11 h-11 rounded-2xl ${styles.iconBg} flex items-center justify-center shrink-0 shadow-inner`}>
                  {getWishIcon(wish.icon)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {wish.title}
                    </h3>
                    <span className={`text-xs font-bold ${styles.num}`}>
                      0{index + 1}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-sans">
                    {wish.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
