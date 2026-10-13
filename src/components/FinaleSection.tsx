import React, { useState, useRef } from 'react';
import { RotateCcw, Sparkles, MessageSquare } from 'lucide-react';
import { StoryContent } from '../types';
import { CloudShape1, CloudShape2, StarIcon, SoftHeartIcon } from './SkyDecorations';

interface FinaleSectionProps {
  content: StoryContent;
  onReplay: () => void;
  onTriggerConfetti: () => void;
  onUploadScreenshot?: (imageUrl: string) => void;
}

export const FinaleSection: React.FC<FinaleSectionProps> = ({
  content,
  onReplay,
  onTriggerConfetti,
  onUploadScreenshot,
}) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const finalFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCandleClick = () => {
    if (!candlesBlown) {
      setCandlesBlown(true);
      setWishMade(true);
      onTriggerConfetti();
    } else {
      setCandlesBlown(false);
      setWishMade(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadScreenshot) {
      const reader = new FileReader();
      reader.onload = () => {
        onUploadScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section
      id="finale"
      className="relative min-h-screen py-24 px-4 sm:px-6 bg-gradient-to-b from-sky-100 via-sky-300 to-purple-200/60 overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Background clouds and stars with lilac touches */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 -left-10 text-white/75 w-80">
          <CloudShape1 className="w-full h-auto" />
        </div>
        <div className="absolute top-20 -right-10 text-white/65 w-72">
          <CloudShape2 className="w-full h-auto" />
        </div>
        <div className="absolute bottom-12 left-1/4 text-white/55 w-96">
          <CloudShape1 className="w-full h-auto" />
        </div>

        {/* Floating stars */}
        <div className="absolute top-1/4 left-16 text-amber-200 animate-pulse">
          <StarIcon className="w-5 h-5" />
        </div>
        <div className="absolute top-1/3 right-16 text-purple-200 animate-pulse" style={{ animationDelay: '1s' }}>
          <StarIcon className="w-4 h-4" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 text-sky-100 animate-pulse" style={{ animationDelay: '2s' }}>
          <StarIcon className="w-6 h-6" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-white/90 animate-bounce" style={{ animationDuration: '5s' }}>
          <SoftHeartIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Full Circle Moment: Bringing back the beginning chat */}
        <div className="w-full max-w-md mx-auto mb-10 pt-2">
          <div className="relative bg-white/95 backdrop-blur-md p-4 sm:p-6 pb-6 rounded-3xl border border-sky-100 shadow-lg shadow-sky-900/5">
            {/* Decorative Washi Tape */}
            <div className="w-20 h-4 bg-purple-100/90 border border-purple-200/60 backdrop-blur-xs mx-auto -mt-7 mb-4 rounded-xs shadow-2xs rotate-[1.2deg]" />

            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Full Circle · Where We Began</span>
              </span>
              {onUploadScreenshot && (
                <button
                  onClick={() => finalFileInputRef.current?.click()}
                  className="text-[11px] text-sky-600 hover:text-sky-800 underline underline-offset-2 cursor-pointer"
                >
                  {content.mayChatScreenshot ? 'Change image' : '+ Add screenshot'}
                </button>
              )}
            </div>

            <input
              type="file"
              ref={finalFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {content.mayChatScreenshot ? (
              <div className="rounded-2xl overflow-hidden border border-sky-100 bg-slate-50 shadow-inner max-h-80 flex items-center justify-center">
                <img
                  src={content.mayChatScreenshot}
                  alt="Full circle beginning of our chat"
                  className="w-full h-auto object-contain max-h-80 rounded-xl cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
                  onError={(e) => {
                    const fallback = 'https://drive.google.com/uc?export=view&id=1jrLKTla3z3g1cpf9D2ZWq2vpzaPrsv2u';
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  onClick={() => {
                    const w = window.open();
                    if (w && content.mayChatScreenshot) {
                      w.document.write(`<body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${content.mayChatScreenshot}" style="max-width:95vw;max-height:95vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);"/></body>`);
                    }
                  }}
                />
              </div>
            ) : (
              <div
                onClick={() => onUploadScreenshot && finalFileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/60 hover:bg-sky-50 flex flex-col items-center justify-center text-center transition-all ${
                  onUploadScreenshot ? 'cursor-pointer group' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white text-sky-500 flex items-center justify-center shadow-2xs mb-2">
                  <MessageSquare className="w-5 h-5 text-sky-500" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Where Our Story Began (May 2026)
                </p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  The beginning of our chat returns here at the end. Tap to add or update the screenshot.
                </p>
              </div>
            )}

            <p className="font-serif-title text-sm sm:text-base text-slate-700 italic mt-3 px-2 text-center">
              “From that first message in May 2026 to celebrating you today.”
            </p>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-sky-900 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>The Celebration · Tracy Anne</span>
        </div>

        {/* Refined Interactive Birthday Cake SVG */}
        <div className="my-8 relative group cursor-pointer" onClick={handleCandleClick}>
          <div className="w-52 h-52 sm:w-60 sm:h-60 mx-auto relative flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full filter drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cake Stand / Plate */}
              <ellipse cx="100" cy="175" rx="85" ry="12" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
              <path d="M75 175v12h50v-12" fill="#bae6fd" />

              {/* Bottom Tier */}
              <rect x="35" y="125" width="130" height="42" rx="10" fill="#ffffff" stroke="#bae6fd" strokeWidth="2" />
              {/* Bottom Frosting drip */}
              <path
                d="M35 137q10 8 20 0t20 0 20 0 20 0 20 0 20 0 10-2"
                stroke="#38bdf8"
                strokeWidth="3"
                fill="none"
              />

              {/* Top Tier */}
              <rect x="55" y="85" width="90" height="42" rx="8" fill="#f0f9ff" stroke="#c084fc" strokeWidth="2" />
              {/* Top Frosting drip in lilac */}
              <path
                d="M55 97q8 6 15 0t15 0 15 0 15 0 15 0 15-2"
                stroke="#a855f7"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Decorative Pearls */}
              <circle cx="65" cy="115" r="3" fill="#38bdf8" />
              <circle cx="80" cy="115" r="3" fill="#c084fc" />
              <circle cx="100" cy="115" r="3.5" fill="#38bdf8" />
              <circle cx="120" cy="115" r="3" fill="#c084fc" />
              <circle cx="135" cy="115" r="3" fill="#38bdf8" />

              {/* Center Heart on Top Tier */}
              <path
                d="M100 102c-1.5-3-5.5-3-7 0-2 4 7 9 7 9s9-5 7-9c-1.5-3-5.5-3-7 0z"
                fill="#38bdf8"
              />

              {/* Candles */}
              {/* Candle 1 (Left) */}
              <rect x="74" y="62" width="5" height="24" rx="2" fill="#38bdf8" />
              <line x1="76.5" y1="58" x2="76.5" y2="62" stroke="#475569" strokeWidth="1.5" />
              {!candlesBlown && (
                <path
                  d="M76.5 47c-2 3-3.5 5 0 9 3.5-4 2-6 0-9z"
                  fill="#f59e0b"
                  className="animate-pulse"
                />
              )}

              {/* Candle 2 (Center) */}
              <rect x="97.5" y="58" width="5" height="28" rx="2" fill="#a855f7" />
              <line x1="100" y1="54" x2="100" y2="58" stroke="#475569" strokeWidth="1.5" />
              {!candlesBlown && (
                <path
                  d="M100 42c-2.5 3-4 6 0 10 4-4 2.5-7 0-10z"
                  fill="#f59e0b"
                  className="animate-pulse"
                />
              )}

              {/* Candle 3 (Right) */}
              <rect x="121" y="62" width="5" height="24" rx="2" fill="#38bdf8" />
              <line x1="123.5" y1="58" x2="123.5" y2="62" stroke="#475569" strokeWidth="1.5" />
              {!candlesBlown && (
                <path
                  d="M123.5 47c-2 3-3.5 5 0 9 3.5-4 2-6 0-9z"
                  fill="#f59e0b"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Candle blowing interactive prompt */}
            <div className="absolute -bottom-2 bg-white/95 px-3.5 py-1.5 rounded-full text-xs font-medium text-sky-900 shadow-sm border border-sky-100 flex items-center gap-1.5 whitespace-nowrap">
              <span>{candlesBlown ? '🕯️ Relight candles' : '🎂 Tap to make a wish & blow candles'}</span>
            </div>
          </div>
        </div>

        {wishMade && (
          <div className="text-sm font-medium text-sky-900 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl mb-6 shadow-sm border border-white animate-fade-in">
            ✨ Your birthday wish has been sent to the sky, Tracy! Happy Birthday! 🩵
          </div>
        )}

        {/* Headline */}
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 text-balance">
          {content.finale.headline}
        </h2>

        {/* Blessing */}
        <p className="text-lg sm:text-xl text-slate-800 font-normal leading-relaxed max-w-xl mb-4 text-balance">
          {content.finale.blessing}
        </p>

        {/* Empowerment */}
        <p className="text-base sm:text-lg text-purple-950 font-medium leading-relaxed max-w-lg mb-6 text-balance">
          {content.finale.empowerment}
        </p>

        {/* Closing Note */}
        <p className="font-serif-title text-2xl sm:text-3xl text-sky-950 italic font-semibold max-w-lg mb-6 leading-snug">
          “{content.finale.closingNote}”
        </p>

        {/* Closing Signature: Beneath the main birthday message */}
        <div className="mb-10 inline-flex flex-col items-center text-center px-4">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent mb-3" />
          <p className="font-serif-title text-lg sm:text-xl font-bold tracking-wide text-sky-950">
            {content.finale.closingSignature || 'Made with love by Abiodun 🩵'}
          </p>
          <p className="font-serif-title text-sm sm:text-base text-slate-700 italic mt-1.5">
            {content.finale.closingSubtext || 'I cared about you, and I wanted you to feel celebrated today.'}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent mt-3" />
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onTriggerConfetti}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-sky-50 text-sky-700 font-medium text-sm shadow-md hover:shadow-lg transition-all border border-sky-100 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Celebrate with Confetti 🎊</span>
          </button>

          <button
            onClick={onReplay}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{content.finale.replayText}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-xs text-sky-900/60 font-medium space-y-1">
          <p>{content.finale.closingSignature || 'Made with love by Abiodun 🩵'}</p>
          <p className="italic text-sky-900/40">
            {content.finale.closingSubtext || 'I cared about you, and I wanted you to feel celebrated today.'}
          </p>
        </div>
      </div>
    </section>
  );
};
