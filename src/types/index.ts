export interface PhotoSlot {
  id: string;
  slotNumber: number;
  layoutType: 'polaroid' | 'scrapbook' | 'fullwidth' | 'card' | 'portrait' | 'offset' | 'lilac-frame' | 'staggered';
  imageUrl: string | null;
  driveId?: string;
  driveUrl?: string;
  placeholderType: 'cloud' | 'stars' | 'camera' | 'horizon' | 'sparkle' | 'envelope' | 'heart' | 'book';
  caption: string;
  chapterLabel: string;
  rotation?: number;
  accentColor?: 'sky' | 'lilac' | 'baby-blue' | 'white';
}

export interface WishItem {
  id: string;
  title: string;
  description: string;
  icon: 'business' | 'peace' | 'friendship' | 'travel' | 'food' | 'faith' | 'joy' | 'smile';
  accent: 'sky' | 'lilac' | 'baby-blue';
}

export interface PersonalityCard {
  id: string;
  tag: string;
  title: string;
  quote: string;
  details: string;
  accent: 'sky' | 'lilac' | 'baby-blue';
  icon: 'globe' | 'utensils' | 'coffee' | 'rocket';
}

export interface StoryContent {
  recipientName: string;
  recipientFullName: string;
  openingTag: string;
  openingSubheading: string;
  openingMessage1: string;
  openingMessage2: string;
  openButtonText: string;

  // Chapter 1: May 2026
  mayTitle: string;
  mayTimelineDate: string;
  mayParagraphs: string[];
  mayChatScreenshot: string | null; // Optional screenshot of early chat

  // Chapter 2: The Girl Behind the Smile
  personalityCards: PersonalityCard[];

  // Chapter 3: The Faith You Carry
  faithTitle: string;
  faithSubtitle: string;
  faithParagraphs: string[];

  // Chapter 4: The Little Things
  littleThingsTitle: string;
  littleThingsIntro: string;
  littleThingsCards: Array<{
    id: string;
    tag: string;
    text: string;
    reflection?: string;
  }>;

  // Chapter 6: Things I Wish for You
  wishes: WishItem[];

  // Chapter 7: A Letter Just for You
  letter: {
    title: string;
    salutation: string;
    paragraphs: string[];
    signoff: string;
  };

  // Finale
  finale: {
    headline: string;
    blessing: string;
    empowerment: string;
    closingNote: string;
    closingSignature?: string;
    closingSubtext?: string;
    replayText: string;
  };
}

export type MusicMode = 'musicbox' | 'custom' | 'off';
