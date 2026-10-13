import React, { useEffect, useState, useRef } from 'react';
import { PhotoSlot, StoryContent } from './types';
import { INITIAL_PHOTO_SLOTS, INITIAL_STORY_CONTENT } from './data/defaultContent';
import {
  loadPhotosFromDB,
  savePhotoToDB,
  deletePhotoFromDB,
  loadStoryContent,
  saveStoryContentToDB,
  resetAllToDefault,
} from './utils/db';
import { Navigation } from './components/Navigation';
import { OpeningSection } from './components/OpeningSection';
import { MayStorySection } from './components/MayStorySection';
import { PersonalitySection } from './components/PersonalitySection';
import { FaithSection } from './components/FaithSection';
import { LittleThingsSection } from './components/LittleThingsSection';
import { PhotoStorySection } from './components/PhotoStorySection';
import { WishesSection } from './components/WishesSection';
import { LetterSection } from './components/LetterSection';
import { FinaleSection } from './components/FinaleSection';
import { PersonalizeModal } from './components/PersonalizeModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { YouTubeMusicPlayer, YouTubePlayerHandle } from './components/YouTubeMusicPlayer';

export default function App() {
  const [slots, setSlots] = useState<PhotoSlot[]>(INITIAL_PHOTO_SLOTS);
  const [content, setContent] = useState<StoryContent>(INITIAL_STORY_CONTENT);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeSection, setActiveSection] = useState('opening');
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [selectedEditSlotId, setSelectedEditSlotId] = useState<string | undefined>();
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const ytPlayerRef = useRef<YouTubePlayerHandle | null>(null);

  // Load persisted photos and content from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    const initializeData = async () => {
      try {
        const storedPhotos = await loadPhotosFromDB();
        const storedContent = await loadStoryContent();
        if (isMounted) {
          if (storedPhotos && storedPhotos.length > 0) {
            // Keep exactly the 7 initial photo configurations while preserving any user customizations
            const merged = INITIAL_PHOTO_SLOTS.map((init) => {
              const existing = storedPhotos.find((s) => s.id === init.id);
              if (existing) {
                return {
                  ...init,
                  caption: existing.caption || init.caption,
                  chapterLabel: existing.chapterLabel || init.chapterLabel,
                  imageUrl: existing.imageUrl || init.imageUrl,
                  driveUrl: init.driveUrl,
                  driveId: init.driveId,
                };
              }
              return init;
            });
            setSlots(merged);
          } else {
            setSlots(INITIAL_PHOTO_SLOTS);
          }
          if (storedContent) {
            setContent({
              ...INITIAL_STORY_CONTENT,
              ...storedContent,
              mayChatScreenshot: storedContent.mayChatScreenshot || INITIAL_STORY_CONTENT.mayChatScreenshot,
              finale: {
                ...INITIAL_STORY_CONTENT.finale,
                ...storedContent.finale,
                closingSignature:
                  storedContent.finale?.closingSignature && storedContent.finale.closingSignature !== 'Made with care for Tracy Anne 🩵'
                    ? storedContent.finale.closingSignature
                    : INITIAL_STORY_CONTENT.finale.closingSignature,
                closingSubtext:
                  storedContent.finale?.closingSubtext || INITIAL_STORY_CONTENT.finale.closingSubtext,
              },
            });
          }
        }
      } catch (err) {
        console.warn('Error loading initial data from database:', err);
      }
    };
    initializeData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Section observer for scroll spy
  useEffect(() => {
    const sectionIds = [
      'opening',
      'may-story',
      'personality',
      'faith',
      'little-things',
      'photos',
      'wishes',
      'letter',
      'finale',
    ];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { threshold: 0.25 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [hasStarted]);

  const handleOpenSurprise = () => {
    setHasStarted(true);
    setConfettiTrigger((prev) => prev + 1);

    // Request playback from persistent YouTube player
    if (ytPlayerRef.current) {
      ytPlayerRef.current.play();
    }

    setTimeout(() => {
      const mayElement = document.getElementById('may-story');
      if (mayElement) {
        mayElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  const handleScrollToSection = (sectionId: string) => {
    setHasStarted(true);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplay = () => {
    // Return to top without restarting or duplicating music
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setActiveSection('opening');
    }, 400);
  };

  const handleOpenEditSlot = (slotId: string) => {
    setSelectedEditSlotId(slotId);
    setIsPersonalizeOpen(true);
  };

  const handleSaveSlot = async (updatedSlot: PhotoSlot) => {
    setSlots((prev) => prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
    await savePhotoToDB(updatedSlot);
  };

  const handleRemovePhoto = async (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, imageUrl: null } : s))
    );
    await deletePhotoFromDB(slotId);
  };

  const handleSaveContent = async (updatedContent: StoryContent) => {
    setContent(updatedContent);
    await saveStoryContentToDB(updatedContent);
  };

  const handleUploadScreenshot = async (imageUrl: string) => {
    const updated = {
      ...content,
      mayChatScreenshot: imageUrl,
    };
    setContent(updated);
    await saveStoryContentToDB(updated);
  };

  const handleResetAll = async () => {
    await resetAllToDefault();
    setSlots(INITIAL_PHOTO_SLOTS);
    setContent(INITIAL_STORY_CONTENT);
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 selection:bg-sky-200 selection:text-sky-900 font-sans">
      {/* Confetti & Particle Canvas */}
      <ConfettiCanvas triggerKey={confettiTrigger} />

      {/* Navigation Header */}
      <Navigation
        activeSection={activeSection}
        onOpenPersonalize={() => {
          setSelectedEditSlotId(undefined);
          setIsPersonalizeOpen(true);
        }}
        onScrollToSection={handleScrollToSection}
        hasStarted={hasStarted}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={() => ytPlayerRef.current?.toggle()}
      />

      <main className="w-full">
        {/* Section 1: The Opening */}
        <OpeningSection
          content={content}
          onOpen={handleOpenSurprise}
          hasStarted={hasStarted}
        />

        {/* Chapter 1: It Started in May */}
        <MayStorySection
          content={content}
          onUploadScreenshot={handleUploadScreenshot}
        />

        {/* Chapter 2: A Little About the Girl Behind the Smile */}
        <PersonalitySection content={content} />

        {/* Chapter 3: The Faith You Carry */}
        <FaithSection content={content} />

        {/* Chapter 4: The Little Things That Make You You */}
        <LittleThingsSection content={content} />

        {/* Chapter 5: A Little Collection of Tracy (The 7 Photos) */}
        <PhotoStorySection
          slots={slots}
          onOpenEditSlot={handleOpenEditSlot}
        />

        {/* Chapter 6: Things I Wish for You */}
        <WishesSection wishes={content.wishes} />

        {/* Chapter 7: A Letter Just for You */}
        <LetterSection content={content} />

        {/* The Final Surprise */}
        <FinaleSection
          content={content}
          onReplay={handleReplay}
          onTriggerConfetti={() => setConfettiTrigger((prev) => prev + 1)}
          onUploadScreenshot={handleUploadScreenshot}
        />
      </main>

      {/* Persistent YouTube Iframe Player (Mounted permanently at root level) */}
      <YouTubeMusicPlayer
        ref={ytPlayerRef}
        videoId="-vSn-pRUFM8"
        onStateChange={setIsMusicPlaying}
      />

      {/* Personalize & Photo Management Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        slots={slots}
        content={content}
        initialSelectedSlotId={selectedEditSlotId}
        onSaveSlot={handleSaveSlot}
        onRemovePhoto={handleRemovePhoto}
        onSaveContent={handleSaveContent}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
