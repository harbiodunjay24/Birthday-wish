import React, { useState } from 'react';
import { Camera, Plus, Sparkles, X } from 'lucide-react';
import { PhotoSlot } from '../types';
import { PlaceholderArt } from './SkyDecorations';

interface PhotoStorySectionProps {
  slots: PhotoSlot[];
  onOpenEditSlot: (slotId: string) => void;
}

export const PhotoStorySection: React.FC<PhotoStorySectionProps> = ({
  slots,
  onOpenEditSlot,
}) => {
  const [lightboxSlot, setLightboxSlot] = useState<PhotoSlot | null>(null);

  const getFrameAccentStyles = (accent?: PhotoSlot['accentColor']) => {
    switch (accent) {
      case 'lilac':
        return {
          cardBg: 'bg-white',
          border: 'border-purple-200/90 shadow-purple-900/5',
          tape: 'bg-purple-100/90 border-purple-200/60',
          tag: 'text-purple-600',
        };
      case 'baby-blue':
        return {
          cardBg: 'bg-white',
          border: 'border-sky-100 shadow-sky-900/5',
          tape: 'bg-sky-100/90 border-sky-200/60',
          tag: 'text-sky-600',
        };
      case 'sky':
      default:
        return {
          cardBg: 'bg-white',
          border: 'border-sky-100 shadow-sky-900/5',
          tape: 'bg-sky-100/90 border-sky-200/60',
          tag: 'text-sky-600',
        };
    }
  };

  return (
    <section id="photos" className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-sky-50 via-white to-sky-50 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-3">
            <span>Chapter Five</span>
            <span aria-hidden="true">·</span>
            <span>A Little Collection of Tracy</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight text-balance mb-4">
            A Little Collection of Tracy
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Seven photographs and cherished moments gathered together. Each frame celebrates her genuine smile, warmth, and grace.
          </p>
        </div>

        {/* Varied 7-Slot Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {slots.map((slot) => {
            const hasPhoto = Boolean(slot.imageUrl);
            const accent = getFrameAccentStyles(slot.accentColor);

            // Responsive layout grid column spans
            let colSpan = 'lg:col-span-6';
            if (slot.layoutType === 'fullwidth') colSpan = 'lg:col-span-12';
            if (slot.layoutType === 'staggered') colSpan = 'lg:col-span-6';
            if (slot.layoutType === 'lilac-frame') colSpan = 'lg:col-span-6';
            if (slot.layoutType === 'offset') colSpan = 'lg:col-span-6';

            return (
              <div
                key={slot.id}
                className={`${colSpan} group relative transition-all duration-300`}
                style={{
                  transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
                }}
              >
                {/* Frame wrapper */}
                {slot.layoutType === 'polaroid' ? (
                  /* Polaroid Frame */
                  <div className={`bg-white p-4 sm:p-5 pb-8 rounded-2xl shadow-md border ${accent.border} hover:shadow-xl hover:shadow-sky-200/50 transition-all`}>
                    {/* Washi tape decoration */}
                    <div className={`w-16 h-4 ${accent.tape} backdrop-blur-xs mx-auto -mt-6 mb-3 rounded-xs border shadow-2xs rotate-[-1.5deg]`} />

                    {/* Image / Placeholder Area */}
                    <div
                      onClick={() => (hasPhoto ? setLightboxSlot(slot) : onOpenEditSlot(slot.id))}
                      className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-sky-50 rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer border border-sky-100/60"
                    >
                      {hasPhoto ? (
                        <img
                          src={slot.imageUrl!}
                          alt={slot.caption}
                          className="w-full h-full object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            if (slot.driveUrl && e.currentTarget.src !== slot.driveUrl) {
                              e.currentTarget.src = slot.driveUrl;
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center p-6 flex flex-col items-center">
                          <PlaceholderArt type={slot.placeholderType} />
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-sky-600 bg-white/90 px-3 py-1 rounded-full border border-sky-100 shadow-2xs">
                            <Camera className="w-3.5 h-3.5 text-sky-500" />
                            <span>Photo Slot 0{slot.slotNumber}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditSlot(slot.id);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-sky-700 rounded-full shadow-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Upload photo"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Polaroid Chin / Caption */}
                    <div className="mt-4 px-1">
                      <div className={`text-xs font-semibold uppercase tracking-wider ${accent.tag} mb-1`}>
                        {slot.chapterLabel}
                      </div>
                      <p className="font-handwriting text-xl text-slate-800 leading-tight">
                        {slot.caption}
                      </p>
                    </div>
                  </div>
                ) : slot.layoutType === 'fullwidth' ? (
                  /* Fullwidth Panorama Card */
                  <div className="bg-white p-5 sm:p-8 rounded-3xl border border-sky-100 shadow-sm hover:shadow-md transition-all">
                    <div
                      onClick={() => (hasPhoto ? setLightboxSlot(slot) : onOpenEditSlot(slot.id))}
                      className="relative w-full aspect-16/9 sm:aspect-21/9 bg-gradient-to-r from-sky-50 via-sky-100/50 to-purple-50/50 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer border border-sky-100"
                    >
                      {hasPhoto ? (
                        <img
                          src={slot.imageUrl!}
                          alt={slot.caption}
                          className="w-full h-full object-cover object-[center_20%]"
                          onError={(e) => {
                            if (slot.driveUrl && e.currentTarget.src !== slot.driveUrl) {
                              e.currentTarget.src = slot.driveUrl;
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center p-6 flex flex-col items-center">
                          <PlaceholderArt type={slot.placeholderType} />
                          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-sky-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                            <span>Featured Panorama Photo · Slot 0{slot.slotNumber}</span>
                          </div>
                          <span className="text-xs text-slate-400 mt-1.5">
                            Click to upload her favorite picture, scenic memory, or birthday portrait
                          </span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditSlot(slot.id);
                        }}
                        className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 hover:bg-white text-sky-700 rounded-full shadow-sm text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{hasPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                          {slot.chapterLabel}
                        </span>
                        <p className="text-base sm:text-lg font-medium text-slate-800">
                          {slot.caption}
                        </p>
                      </div>
                      <button
                        onClick={() => onOpenEditSlot(slot.id)}
                        className="self-start sm:self-center text-xs text-sky-600 hover:text-sky-700 underline underline-offset-4 cursor-pointer"
                      >
                        {hasPhoto ? 'Edit caption' : 'Personalize frame'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Elegant Sky or Lilac Frame */
                  <div className={`bg-white p-5 rounded-3xl border ${accent.border} shadow-sm hover:shadow-md transition-all`}>
                    <div
                      onClick={() => (hasPhoto ? setLightboxSlot(slot) : onOpenEditSlot(slot.id))}
                      className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-sky-50/70 rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer border border-sky-100"
                    >
                      {hasPhoto ? (
                        <img
                          src={slot.imageUrl!}
                          alt={slot.caption}
                          className="w-full h-full object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            if (slot.driveUrl && e.currentTarget.src !== slot.driveUrl) {
                              e.currentTarget.src = slot.driveUrl;
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center p-6 flex flex-col items-center">
                          <PlaceholderArt type={slot.placeholderType} />
                          <div className={`mt-3 text-xs font-medium ${accent.tag} bg-white/90 px-3 py-1 rounded-full border border-slate-100`}>
                            Photo Slot 0{slot.slotNumber}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditSlot(slot.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-sky-700 rounded-full shadow-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Upload or edit"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 px-1">
                      <span className={`text-xs font-semibold ${accent.tag}`}>{slot.chapterLabel}</span>
                      <p className="text-sm sm:text-base font-medium text-slate-800 mt-1">
                        {slot.caption}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-14 text-center">
          <p className="text-xs text-slate-400">
            Tip: Click any photograph to view in full resolution, or personalize captions via “Edit Memories”.
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxSlot && (lightboxSlot.imageUrl || lightboxSlot.driveUrl) && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxSlot(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxSlot(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
              aria-label="Close photo viewer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[72vh] p-2">
              <img
                src={lightboxSlot.imageUrl || lightboxSlot.driveUrl!}
                alt={lightboxSlot.caption}
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
                onError={(e) => {
                  if (lightboxSlot.driveUrl && e.currentTarget.src !== lightboxSlot.driveUrl) {
                    e.currentTarget.src = lightboxSlot.driveUrl;
                  }
                }}
              />
            </div>

            <div className="p-6 bg-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                {lightboxSlot.chapterLabel}
              </span>
              <p className="text-base sm:text-lg font-medium text-slate-800 mt-1">
                {lightboxSlot.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
