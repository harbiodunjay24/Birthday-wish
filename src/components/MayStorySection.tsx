import React, { useRef } from 'react';
import { Calendar, Globe, MessageSquarePlus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { StoryContent } from '../types';

interface MayStorySectionProps {
  content: StoryContent;
  onUploadScreenshot?: (imageUrl: string) => void;
}

export const MayStorySection: React.FC<MayStorySectionProps> = ({
  content,
  onUploadScreenshot,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    <section id="may-story" className="relative py-24 px-4 sm:px-6 bg-sky-50 overflow-hidden">
      {/* Background accents with subtle lilac tint */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute bottom-12 right-10 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Editorial Chapter Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-3">
            <span>Chapter One</span>
            <span aria-hidden="true">·</span>
            <span>Where It Started</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance">
            {content.mayTitle}
          </h2>
        </div>

        {/* Timeline Story Card */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-sky-100 shadow-sm shadow-sky-100/50">
          {/* Timeline Spine Marker */}
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-sky-100/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-300 flex items-center justify-center text-white shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Timeline</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {content.mayTimelineDate || 'May 2026'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs text-sky-700 font-medium">
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>Met Online</span>
            </div>
          </div>

          {/* Narrative Paragraphs */}
          <div className="space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
            {content.mayParagraphs.map((paragraph, idx) => {
              const isFirst = idx === 0;
              const isThird = idx === 2;
              return (
                <p
                  key={idx}
                  className={
                    isFirst
                      ? 'font-serif-title text-2xl sm:text-3xl text-sky-950 font-normal italic leading-snug'
                      : isThird
                      ? 'font-medium text-slate-800'
                      : 'text-slate-600'
                  }
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Early Conversation Screenshot / Scrapbook Keepsake */}
          <div className="mt-10 pt-8 border-t border-sky-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>Where Our Story Began · May 2026</span>
              </span>
              {onUploadScreenshot && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-sky-600 hover:text-sky-800 font-medium underline underline-offset-4 cursor-pointer"
                >
                  {content.mayChatScreenshot ? 'Replace screenshot' : '+ Upload screenshot'}
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {content.mayChatScreenshot ? (
              <div className="relative group bg-sky-50/60 p-3 sm:p-5 rounded-2xl border border-sky-100 shadow-sm">
                {/* Washi tape decoration */}
                <div className="w-20 h-4 bg-purple-100/90 border border-purple-200/60 backdrop-blur-xs mx-auto -mt-6 mb-3 rounded-xs shadow-2xs rotate-[-1deg]" />

                <div className="rounded-xl overflow-hidden border border-white shadow-md bg-white flex flex-col items-center">
                  <img
                    src={content.mayChatScreenshot}
                    alt="Authentic beginning of our chat in May 2026"
                    className="w-full h-auto object-contain max-h-96 rounded-lg cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
                    onError={(e) => {
                      const fallback = 'https://drive.google.com/uc?export=view&id=1jrLKTla3z3g1cpf9D2ZWq2vpzaPrsv2u';
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    onClick={() => {
                      // Open full view in new tab or modal
                      const w = window.open();
                      if (w && content.mayChatScreenshot) {
                        w.document.write(`<body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;"><img src="${content.mayChatScreenshot}" style="max-width:95vw;max-height:95vh;object-fit:contain;border-radius:12px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);"/></body>`);
                      }
                    }}
                  />
                  <div className="py-3 px-4 text-center w-full bg-white/90 border-t border-sky-50">
                    <p className="font-serif-title text-base sm:text-lg text-slate-800 italic">
                      “Where it all started — the very first conversation in May 2026.”
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => onUploadScreenshot && fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/60 hover:bg-sky-50 hover:border-sky-300 flex flex-col items-center justify-center text-center transition-all ${
                  onUploadScreenshot ? 'cursor-pointer group' : ''
                }`}
              >
                {/* Washi tape placeholder */}
                <div className="w-16 h-3.5 bg-sky-100 border border-sky-200/70 -mt-10 mb-4 rounded-xs shadow-2xs rotate-[-1.5deg]" />

                <div className="w-12 h-12 rounded-2xl bg-white text-sky-500 flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <MessageSquarePlus className="w-6 h-6 text-sky-500" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-800">
                  The Beginning of Our Chat (May 2026)
                </h4>
                <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                  Placeholder reserved for the authentic screenshot showing where our story began in May 2026.
                </p>
                {onUploadScreenshot && (
                  <span className="mt-3 px-3.5 py-1.5 rounded-full bg-white text-sky-700 text-xs font-semibold shadow-2xs border border-sky-100 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    Tap to upload chat screenshot
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quiet Timeline Footnote */}
          <div className="mt-8 pt-6 border-t border-sky-50 flex items-center justify-between text-xs text-slate-400">
            <span>May 2026 · An unexpected connection</span>
            <span className="text-sky-600 font-medium">To this special birthday for Tracy 🩵</span>
          </div>
        </div>
      </div>
    </section>
  );
};
