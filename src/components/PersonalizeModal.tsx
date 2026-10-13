import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Trash2,
  Check,
  Download,
  RotateCcw,
  Music,
  Image as ImageIcon,
  FileText,
  ShieldAlert,
  Info,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { PhotoSlot, StoryContent } from '../types';
import { musicPlayer } from '../utils/audio';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: PhotoSlot[];
  content: StoryContent;
  initialSelectedSlotId?: string;
  onSaveSlot: (slot: PhotoSlot) => void;
  onRemovePhoto: (slotId: string) => void;
  onSaveContent: (content: StoryContent) => void;
  onResetAll: () => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  slots,
  content,
  initialSelectedSlotId,
  onSaveSlot,
  onRemovePhoto,
  onSaveContent,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'story' | 'screenshot' | 'music' | 'help'>('photos');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    initialSelectedSlotId || slots[0]?.id || 'photo-1'
  );

  // Local slot states
  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];
  const [draftCaption, setDraftCaption] = useState(selectedSlot?.caption || '');
  const [draftLabel, setDraftLabel] = useState(selectedSlot?.chapterLabel || '');
  const [saveToast, setSaveToast] = useState(false);

  // Story drafts
  const [recipientName, setRecipientName] = useState(content.recipientName);
  const [recipientFullName, setRecipientFullName] = useState(content.recipientFullName);
  const [mayTimelineDate, setMayTimelineDate] = useState(content.mayTimelineDate);
  const [letterParagraphs, setLetterParagraphs] = useState(content.letter.paragraphs);
  const [letterSignoff, setLetterSignoff] = useState(content.letter.signoff);
  const [chatScreenshot, setChatScreenshot] = useState<string | null>(content.mayChatScreenshot);
  const [closingSignature, setClosingSignature] = useState(
    content.finale?.closingSignature || 'Made with love by Abiodun 🩵'
  );
  const [closingSubtext, setClosingSubtext] = useState(
    content.finale?.closingSubtext || 'I cared about you, and I wanted you to feel celebrated today.'
  );

  // Music state
  const [audioFileName, setAudioFileName] = useState(musicPlayer.getCustomAudioName());

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScreenshotInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Sync draft when slot changes
  const handleSelectSlot = (slot: PhotoSlot) => {
    setSelectedSlotId(slot.id);
    setDraftCaption(slot.caption);
    setDraftLabel(slot.chapterLabel);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlot) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updatedSlot: PhotoSlot = {
        ...selectedSlot,
        imageUrl: result,
        caption: draftCaption,
        chapterLabel: draftLabel,
      };
      onSaveSlot(updatedSlot);
      showToast();
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateSlotMeta = () => {
    if (!selectedSlot) return;
    const updatedSlot: PhotoSlot = {
      ...selectedSlot,
      caption: draftCaption,
      chapterLabel: draftLabel,
    };
    onSaveSlot(updatedSlot);
    showToast();
  };

  const handleRemoveImage = () => {
    if (!selectedSlot) return;
    onRemovePhoto(selectedSlot.id);
    showToast();
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setChatScreenshot(result);
      const updatedContent = {
        ...content,
        mayChatScreenshot: result,
      };
      onSaveContent(updatedContent);
      showToast();
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setChatScreenshot(null);
    const updatedContent = {
      ...content,
      mayChatScreenshot: null,
    };
    onSaveContent(updatedContent);
    showToast();
  };

  const handleSaveStoryChanges = () => {
    const updatedContent: StoryContent = {
      ...content,
      recipientName,
      recipientFullName,
      mayTimelineDate,
      mayChatScreenshot: chatScreenshot,
      letter: {
        ...content.letter,
        paragraphs: letterParagraphs,
        signoff: letterSignoff,
      },
      finale: {
        ...content.finale,
        closingSignature,
        closingSubtext,
      },
    };
    onSaveContent(updatedContent);
    showToast();
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      musicPlayer.setCustomAudio(file);
      setAudioFileName(file.name);
      showToast();
    }
  };

  const handleRemoveAudio = () => {
    musicPlayer.removeCustomAudio();
    setAudioFileName('');
    showToast();
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleExportJSON = () => {
    const exportData = {
      slots,
      content: {
        ...content,
        recipientName,
        recipientFullName,
        mayTimelineDate,
        mayChatScreenshot: chatScreenshot,
        letter: {
          ...content.letter,
          paragraphs: letterParagraphs,
          signoff: letterSignoff,
        },
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracy-anne-birthday-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Personalize Tracy Anne’s Birthday Website
              </h3>
              <p className="text-xs text-slate-500">
                Upload her real photos, early chat screenshots, or edit story copy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-100 flex gap-2 overflow-x-auto bg-white py-2">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'photos'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-sky-500" />
            <span>Photo Memories ({slots.filter((s) => s.imageUrl).length}/{slots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('screenshot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'screenshot'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-sky-500" />
            <span>May Chat Screenshot</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'story'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-500" />
            <span>Letter & Story Text</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'music'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Music className="w-4 h-4 text-sky-500" />
            <span>Background Music</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'help'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Info className="w-4 h-4 text-sky-500" />
            <span>Storage & Publishing</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: 8 PHOTO SLOTS */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Slot picker bar for 7 slots */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select a Photo Slot to Edit ({slots.length} Total Slots)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {slots.map((s) => {
                    const isSelected = s.id === selectedSlotId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSelectSlot(s)}
                        className={`p-2 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-200'
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl bg-sky-100/60 overflow-hidden mb-1.5 flex items-center justify-center">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[11px] text-sky-600 font-semibold">Slot {s.slotNumber}</span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 truncate">
                          Slot 0{s.slotNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {s.imageUrl ? 'Photo ready' : 'Empty'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot editor panel */}
              {selectedSlot && (
                <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Left: Image Preview & Upload Controls */}
                    <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
                      <div className="w-full aspect-square rounded-2xl bg-sky-50 border-2 border-dashed border-sky-200 flex flex-col items-center justify-center overflow-hidden relative group">
                        {selectedSlot.imageUrl ? (
                          <>
                            <img
                              src={selectedSlot.imageUrl}
                              alt="Slot preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-white text-sky-700 rounded-full text-xs shadow-md"
                                title="Change image"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleRemoveImage}
                                className="p-2 bg-white text-rose-600 rounded-full text-xs shadow-md"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Upload className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                            <span className="text-xs text-sky-700 font-medium block">
                              No image uploaded yet
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              Supports JPG, PNG, WEBP
                            </span>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      <div className="flex gap-2 w-full mt-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{selectedSlot.imageUrl ? 'Replace' : 'Upload Photo'}</span>
                        </button>
                        {selectedSlot.imageUrl && (
                          <button
                            onClick={handleRemoveImage}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: Caption and Label metadata */}
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Chapter / Memory Label
                        </label>
                        <input
                          type="text"
                          value={draftLabel}
                          onChange={(e) => setDraftLabel(e.target.value)}
                          placeholder="e.g. Chapter 01 · May 2026"
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Caption / Personal Thought
                        </label>
                        <textarea
                          rows={3}
                          value={draftCaption}
                          onChange={(e) => setDraftCaption(e.target.value)}
                          placeholder="A little moment worth remembering..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleUpdateSlotMeta}
                          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Slot 0{selectedSlot.slotNumber} Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MAY CHAT SCREENSHOT */}
          {activeTab === 'screenshot' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-sky-100">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-800">
                <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Chapter 1 Keepsake & Full-Circle Moment:</strong> Add the authentic screenshot showing the beginning of your chat in May 2026. It is presented inside Chapter 1 and brought back full-circle at the end before the final birthday message.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-64 aspect-4/3 rounded-2xl bg-slate-50 border-2 border-dashed border-sky-200 overflow-hidden flex items-center justify-center relative">
                  {chatScreenshot ? (
                    <img src={chatScreenshot} alt="Chat screenshot" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-4">
                      <MessageSquare className="w-8 h-8 text-sky-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No screenshot uploaded yet</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="file"
                    ref={chatScreenshotInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleScreenshotUpload}
                  />

                  <button
                    onClick={() => chatScreenshotInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{chatScreenshot ? 'Replace Screenshot' : 'Upload Early Chat Screenshot'}</span>
                  </button>

                  {chatScreenshot && (
                    <button
                      onClick={handleRemoveScreenshot}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Screenshot</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORY & LETTER */}
          {activeTab === 'story' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-sky-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={recipientFullName}
                    onChange={(e) => setRecipientFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapter 1 Timeline Marker
                </label>
                <input
                  type="text"
                  value={mayTimelineDate}
                  onChange={(e) => setMayTimelineDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Chapter 7: Letter Paragraphs
                </label>
                <div className="space-y-3">
                  {letterParagraphs.map((para, idx) => (
                    <div key={idx} className="flex gap-2">
                      <textarea
                        rows={2}
                        value={para}
                        onChange={(e) => {
                          const updated = [...letterParagraphs];
                          updated[idx] = e.target.value;
                          setLetterParagraphs(updated);
                        }}
                        className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Letter Handwritten Sign-off
                </label>
                <input
                  type="text"
                  value={letterSignoff}
                  onChange={(e) => setLetterSignoff(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Finale Closing Signature (Beneath Birthday Message)
                </label>
                <input
                  type="text"
                  value={closingSignature}
                  onChange={(e) => setClosingSignature(e.target.value)}
                  placeholder="Made with love by Abiodun 🩵"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Closing Subtext / Sentiment Line
                </label>
                <input
                  type="text"
                  value={closingSubtext}
                  onChange={(e) => setClosingSubtext(e.target.value)}
                  placeholder="I cared about you, and I wanted you to feel celebrated today."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveStoryChanges}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Story & Letter Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: MUSIC */}
          {activeTab === 'music' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-sky-100">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-800">
                <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <p>
                  <strong>No copyrighted audio is bundled.</strong> The website synthesizes a calming ambient music box lullaby using Web Audio. If you have a specific song Tracy loves, you can upload an audio track directly from your computer or phone.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Current Music Configuration</h4>
                {audioFileName ? (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-sky-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{audioFileName}</p>
                        <p className="text-[11px] text-slate-500">Custom audio track loaded</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveAudio}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      Reset to Music Box Melody
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-800">
                      Gentle Celestial Music Box (Built-in Web Audio API)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Plays a peaceful, copyright-free arpeggio in soothing F-major harmony.
                    </p>
                  </div>
                )}

                <div>
                  <input
                    type="file"
                    ref={audioInputRef}
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudioUpload}
                  />
                  <button
                    onClick={() => audioInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Custom Song (MP3 / WAV / M4A)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STORAGE & PUBLISHING INFO */}
          {activeTab === 'help' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-sky-100 text-slate-700 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sky-900">How Browser Storage (IndexedDB) Works</h4>
                  <p className="text-slate-600 leading-relaxed">
                    All images and text modifications made in this editor are stored locally in your browser’s IndexedDB database. They will persist across page refreshes and browser restarts on this machine.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-900">Important Note on Publishing to Tracy’s Phone</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Browser storage is isolated to each device. To share the website with Tracy so she sees the pictures on her own phone, you can either:
                  </p>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-600">
                    <li>Download the <strong>Backup File (JSON)</strong> below containing your customized photos and copy.</li>
                    <li>Or place her photos directly into the project assets folder before deployment.</li>
                    <li>If you open the site together on this device, everything is immediately ready!</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup File (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset all photos and custom edits to original template?')) {
                      onResetAll();
                      onClose();
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Template Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-sky-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Changes saved locally!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Done & Preview Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
