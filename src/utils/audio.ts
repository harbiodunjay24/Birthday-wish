/**
 * Web Audio Ambient Music Box & Custom Audio Controller
 * Synthesizes a gentle, copyright-free music box melody inspired by clear blue skies.
 * Supports custom user-uploaded audio tracks without external network requests.
 */

class AudioController {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private customAudioName: string = '';
  private volume = 0.4;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  constructor() {
    // Check if custom audio was saved
    const savedName = localStorage.getItem('sky_blue_audio_name');
    if (savedName) {
      this.customAudioName = savedName;
    }
  }

  public subscribe(cb: (isPlaying: boolean) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCustomAudioName(): string {
    return this.customAudioName;
  }

  public setCustomAudio(file: File) {
    if (this.customAudioUrl) {
      URL.revokeObjectURL(this.customAudioUrl);
    }
    this.customAudioUrl = URL.createObjectURL(file);
    this.customAudioName = file.name;
    localStorage.setItem('sky_blue_audio_name', file.name);

    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.customAudio = new Audio(this.customAudioUrl);
    this.customAudio.loop = true;
    this.customAudio.volume = this.volume;

    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public removeCustomAudio() {
    if (this.customAudioUrl) {
      URL.revokeObjectURL(this.customAudioUrl);
      this.customAudioUrl = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.customAudioName = '';
    localStorage.removeItem('sky_blue_audio_name');
    if (this.isPlaying) {
      this.stop();
    }
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.play();
      return true;
    }
  }

  public async play(): Promise<void> {
    if (this.isPlaying) return;

    if (this.customAudio) {
      try {
        await this.customAudio.play();
        this.isPlaying = true;
        this.notify();
        return;
      } catch (e) {
        console.warn('Custom audio playback failed, falling back to music box melody', e);
      }
    }

    // Gentle music box synthesis via Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.isPlaying = true;
      this.notify();
      this.startMelodyLoop();
    } catch (e) {
      console.warn('AudioContext initiation failed', e);
      this.isPlaying = false;
      this.notify();
    }
  }

  public stop(): void {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  private playTone(freq: number, duration: number = 1.2, detune: number = 0) {
    if (!this.audioCtx || this.audioCtx.state === 'closed') return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);

    // Subtle sweet chime overtone
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    osc2.detune.setValueAtTime(detune + 4, now);

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration);
    osc2.stop(now + duration);
  }

  private startMelodyLoop() {
    // Gentle lullaby / music box notes (Pentatonic F major: F4, G4, A4, C5, D5, F5, G5, A5)
    // Notes frequencies (Hz):
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const C5 = 523.25;
    const D5 = 587.33;
    const F5 = 698.46;
    const G5 = 783.99;
    const A5 = 880.0;

    // Soothing 16-step contemplative melody
    const sequence = [
      F4, C5, A4, F5,
      G4, D5, C5, G5,
      A4, F5, D5, A5,
      C5, G4, A4, F4,
    ];

    let step = 0;
    const stepInterval = 480; // ms per note

    // Play immediate first note
    this.playTone(sequence[0]);
    step = 1;

    this.timerId = window.setInterval(() => {
      if (!this.isPlaying) return;
      const note = sequence[step % sequence.length];
      this.playTone(note, 1.4);
      // occasional soft harmony bass note
      if (step % 4 === 0) {
        this.playTone(F4 * 0.5, 2.0);
      }
      step++;
    }, stepInterval);
  }
}

export const musicPlayer = new AudioController();
