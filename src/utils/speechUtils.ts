import { Language } from '../types/gujarat';
import { ambientAudioManager } from './ambientAudio';

export type SarvamSpeakerId = 'priya' | 'shubh' | 'ritu' | 'kabir';
export type VoiceProvider = 'sarvam' | 'browser';

export interface SarvamSpeakerOption {
  id: SarvamSpeakerId;
  labelGu: string;
  labelEn: string;
}

export const SARVAM_SPEAKERS: SarvamSpeakerOption[] = [
  { id: 'priya', labelGu: 'પ્રિયા (સ્પષ્ટ)', labelEn: 'Priya' },
  { id: 'shubh', labelGu: 'શુભ (શિક્ષક)', labelEn: 'Shubh' },
  { id: 'ritu', labelGu: 'રીતુ (સૌમ્ય)', labelEn: 'Ritu' },
  { id: 'kabir', labelGu: 'કબીર (ગંભીર)', labelEn: 'Kabir' },
];

export interface SpeechSegment {
  id: string;
  label?: string;
  text: string;
}

export interface SpeechSequenceOptions {
  startIndex?: number;
  onSegmentStart?: (segment: SpeechSegment, index: number) => void;
  onSequenceComplete?: () => void;
}

export interface SpeechStatePayload {
  speaking: boolean;
  paused: boolean;
  loading: boolean;
  provider: VoiceProvider;
  activeSegmentId: string | null;
  activeSegmentLabel: string | null;
  segmentIndex: number;
  totalSegments: number;
  errorMessage?: string | null;
}

interface CachedAudioClip {
  base64: string;
  mimeType: string;
}

class GujaratiSpeechController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private abortController: AbortController | null = null;
  private activeProvider: VoiceProvider = 'browser';
  private audioCache = new Map<string, CachedAudioClip>();
  private inFlightFetches = new Map<string, Promise<CachedAudioClip | null>>();
  private speaker: SarvamSpeakerId = 'priya';
  private sarvamAvailable: boolean | null = null;
  private listeners = new Set<(state: SpeechStatePayload) => void>();

  private runToken = 0;
  private isSequencePaused = false;
  private resumeWaiter: (() => void) | null = null;
  private activeSegmentResolve: ((outcome: 'completed' | 'cancelled' | 'error') => void) | null =
    null;

  private activeSegmentId: string | null = null;
  private activeSegmentLabel: string | null = null;
  private segmentIndex = 0;
  private totalSegments = 0;

  public isBrowserSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined';
  }

  public getSpeaker(): SarvamSpeakerId {
    return this.speaker;
  }

  public setSpeaker(speaker: SarvamSpeakerId): void {
    this.speaker = speaker;
  }

  public async checkSarvamStatus(): Promise<boolean> {
    try {
      const res = await fetch('/api/tts/status');
      if (!res.ok) {
        this.sarvamAvailable = false;
        return false;
      }
      const data = (await res.json()) as { sarvamConfigured?: boolean };
      this.sarvamAvailable = Boolean(data.sarvamConfigured);
      return this.sarvamAvailable;
    } catch {
      this.sarvamAvailable = false;
      return false;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isBrowserSpeechSupported()) return [];
    return window.speechSynthesis.getVoices();
  }

  public findBestVoice(lang: Language): { voice: SpeechSynthesisVoice | null; exactMatch: boolean } {
    const voices = this.getVoices();
    const targetPrefix = lang === 'gu' ? 'gu' : lang === 'hi' ? 'hi' : 'en';

    const exact = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
    if (exact) return { voice: exact, exactMatch: true };

    if (lang === 'gu') {
      const hi = voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
      if (hi) return { voice: hi, exactMatch: false };
      const enIn = voices.find((v) => v.lang.toLowerCase() === 'en-in');
      if (enIn) return { voice: enIn, exactMatch: false };
    }

    const enFallback = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    return { voice: enFallback ?? null, exactMatch: false };
  }

  public subscribe(cb: (state: SpeechStatePayload) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private emit(partial: Omit<SpeechStatePayload, 'activeSegmentId' | 'activeSegmentLabel' | 'segmentIndex' | 'totalSegments'>): void {
    const payload: SpeechStatePayload = {
      ...partial,
      activeSegmentId: this.activeSegmentId,
      activeSegmentLabel: this.activeSegmentLabel,
      segmentIndex: this.segmentIndex,
      totalSegments: this.totalSegments,
    };
    this.listeners.forEach((cb) => cb(payload));
  }

  private base64ToBlobUrl(base64: string, mimeType: string): string {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  private cleanupAudioElement(): void {
    if (this.currentAudio) {
      this.currentAudio.onplay = null;
      this.currentAudio.onpause = null;
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }

  private cacheClip(key: string, clip: CachedAudioClip): void {
    if (this.audioCache.size >= 60) {
      const firstKey = this.audioCache.keys().next().value;
      if (firstKey) this.audioCache.delete(firstKey);
    }
    this.audioCache.set(key, clip);
  }

  private async fetchSarvamClip(
    text: string,
    lang: Language,
    signal?: AbortSignal
  ): Promise<CachedAudioClip | null> {
    if (this.sarvamAvailable === false) return null;

    const cacheKey = `${lang}:${this.speaker}:${text}`;
    const cached = this.audioCache.get(cacheKey);
    if (cached) return cached;

    const existing = this.inFlightFetches.get(cacheKey);
    if (existing) {
      return existing;
    }

    const requestPromise = (async (): Promise<CachedAudioClip | null> => {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language: lang,
            speaker: this.speaker,
            pace: 0.96,
          }),
          signal,
        });

        if (!response.ok) {
          if (response.status === 503) {
            this.sarvamAvailable = false;
          }
          return null;
        }

        const data = (await response.json()) as {
          audioBase64?: string;
          mimeType?: string;
        };

        if (!data.audioBase64) return null;

        this.sarvamAvailable = true;
        const clip: CachedAudioClip = {
          base64: data.audioBase64,
          mimeType: data.mimeType || 'audio/mpeg',
        };
        this.cacheClip(cacheKey, clip);
        return clip;
      } catch {
        return null;
      } finally {
        this.inFlightFetches.delete(cacheKey);
      }
    })();

    this.inFlightFetches.set(cacheKey, requestPromise);
    return requestPromise;
  }

  private speakBrowserSegment(
    text: string,
    lang: Language,
    token: number
  ): Promise<'completed' | 'cancelled' | 'error'> {
    return new Promise((resolve) => {
      if (token !== this.runToken) {
        resolve('cancelled');
        return;
      }
      if (!this.isBrowserSpeechSupported()) {
        this.emit({
          speaking: false,
          paused: false,
          loading: false,
          provider: 'browser',
          errorMessage: 'Speech synthesis is not supported in this browser.',
        });
        resolve('error');
        return;
      }

      this.activeProvider = 'browser';
      const utterance = new SpeechSynthesisUtterance(text);
      const { voice } = this.findBestVoice(lang);
      utterance.lang = lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.94;
      utterance.pitch = 1.0;

      const finish = (outcome: 'completed' | 'cancelled' | 'error') => {
        if (this.activeSegmentResolve === finish) {
          this.activeSegmentResolve = null;
        }
        utterance.onstart = null;
        utterance.onpause = null;
        utterance.onresume = null;
        utterance.onend = null;
        utterance.onerror = null;
        this.currentUtterance = null;
        resolve(outcome);
      };

      this.activeSegmentResolve = finish;

      utterance.onstart = () => {
        if (token !== this.runToken) return;
        ambientAudioManager.setDucked(true);
        this.emit({
          speaking: true,
          paused: false,
          loading: false,
          provider: 'browser',
        });
      };
      utterance.onpause = () => {
        if (token !== this.runToken) return;
        ambientAudioManager.setDucked(false);
        this.emit({
          speaking: true,
          paused: true,
          loading: false,
          provider: 'browser',
        });
      };
      utterance.onresume = () => {
        if (token !== this.runToken) return;
        ambientAudioManager.setDucked(true);
        this.emit({
          speaking: true,
          paused: false,
          loading: false,
          provider: 'browser',
        });
      };
      utterance.onend = () => {
        ambientAudioManager.setDucked(false);
        finish(token === this.runToken ? 'completed' : 'cancelled');
      };
      utterance.onerror = () => {
        ambientAudioManager.setDucked(false);
        finish(token === this.runToken ? 'error' : 'cancelled');
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  private playAudioClipSegment(
    clip: CachedAudioClip,
    token: number
  ): Promise<'completed' | 'cancelled' | 'error'> {
    return new Promise((resolve) => {
      if (token !== this.runToken) {
        resolve('cancelled');
        return;
      }

      this.cleanupAudioElement();
      const url = this.base64ToBlobUrl(clip.base64, clip.mimeType);
      this.currentObjectUrl = url;

      const audio = new Audio(url);
      this.currentAudio = audio;
      this.activeProvider = 'sarvam';

      const finish = (outcome: 'completed' | 'cancelled' | 'error') => {
        if (this.activeSegmentResolve === finish) {
          this.activeSegmentResolve = null;
        }
        this.cleanupAudioElement();
        resolve(outcome);
      };

      this.activeSegmentResolve = finish;

      audio.onplay = () => {
        if (token !== this.runToken) return;
        ambientAudioManager.setDucked(true);
        this.emit({
          speaking: true,
          paused: false,
          loading: false,
          provider: 'sarvam',
        });
      };

      audio.onpause = () => {
        if (token !== this.runToken) return;
        if (!audio.ended && this.currentAudio === audio) {
          ambientAudioManager.setDucked(false);
          this.emit({
            speaking: true,
            paused: true,
            loading: false,
            provider: 'sarvam',
          });
        }
      };

      audio.onended = () => {
        ambientAudioManager.setDucked(false);
        finish(token === this.runToken ? 'completed' : 'cancelled');
      };

      audio.onerror = () => {
        ambientAudioManager.setDucked(false);
        finish(token === this.runToken ? 'error' : 'cancelled');
      };

      void audio.play().catch(() => {
        ambientAudioManager.setDucked(false);
        finish(token === this.runToken ? 'error' : 'cancelled');
      });
    });
  }

  private async waitIfPaused(token: number): Promise<boolean> {
    if (!this.isSequencePaused) return token === this.runToken;
    await new Promise<void>((resolve) => {
      this.resumeWaiter = resolve;
    });
    this.resumeWaiter = null;
    return token === this.runToken;
  }

  private async pauseBreather(ms: number, token: number): Promise<boolean> {
    await new Promise((r) => setTimeout(r, ms));
    if (token !== this.runToken) return false;
    return this.waitIfPaused(token);
  }

  public async speak(text: string, lang: Language): Promise<void> {
    await this.speakSequence([{ id: 'single', text }], lang);
  }

  public async speakSequence(
    segments: SpeechSegment[],
    lang: Language,
    options?: SpeechSequenceOptions
  ): Promise<void> {
    this.stop();

    const cleanSegments = segments.filter((s) => s.text.trim().length > 0);
    if (cleanSegments.length === 0) return;

    const token = ++this.runToken;
    this.isSequencePaused = false;
    this.totalSegments = cleanSegments.length;

    const startIdx = Math.max(
      0,
      Math.min(cleanSegments.length - 1, options?.startIndex ?? 0)
    );

    const controller = new AbortController();
    this.abortController = controller;

    for (let i = startIdx; i < cleanSegments.length; i++) {
      if (token !== this.runToken) return;
      if (!(await this.waitIfPaused(token))) return;

      const segment = cleanSegments[i];
      this.activeSegmentId = segment.id;
      this.activeSegmentLabel = segment.label ?? null;
      this.segmentIndex = i;
      options?.onSegmentStart?.(segment, i);

      let outcome: 'completed' | 'cancelled' | 'error' = 'completed';

      if (this.sarvamAvailable !== false) {
        const cacheKey = `${lang}:${this.speaker}:${segment.text}`;
        if (!this.audioCache.has(cacheKey)) {
          this.emit({
            speaking: false,
            paused: false,
            loading: true,
            provider: 'sarvam',
          });
        }

        // Prefetch the very next segment in background while playing current one
        const nextSegment = cleanSegments[i + 1];
        if (nextSegment) {
          void this.fetchSarvamClip(nextSegment.text, lang, controller.signal);
        }

        const clip = await this.fetchSarvamClip(segment.text, lang, controller.signal);
        if (token !== this.runToken || controller.signal.aborted) return;

        if (clip) {
          outcome = await this.playAudioClipSegment(clip, token);
          if (outcome === 'error' && token === this.runToken) {
            outcome = await this.speakBrowserSegment(segment.text, lang, token);
          }
        } else {
          outcome = await this.speakBrowserSegment(segment.text, lang, token);
        }
      } else {
        outcome = await this.speakBrowserSegment(segment.text, lang, token);
      }

      if (outcome === 'cancelled' || token !== this.runToken) {
        return;
      }

      if (i < cleanSegments.length - 1) {
        const keepGoing = await this.pauseBreather(260, token);
        if (!keepGoing) return;
      }
    }

    if (token !== this.runToken) return;

    this.activeSegmentId = null;
    this.activeSegmentLabel = null;
    this.segmentIndex = 0;
    this.totalSegments = 0;
    if (this.abortController === controller) {
      this.abortController = null;
    }

    ambientAudioManager.setDucked(false);
    this.emit({
      speaking: false,
      paused: false,
      loading: false,
      provider: this.sarvamAvailable ? 'sarvam' : 'browser',
    });

    options?.onSequenceComplete?.();
  }

  public pause(): void {
    this.isSequencePaused = true;

    if (this.activeProvider === 'sarvam' && this.currentAudio) {
      if (!this.currentAudio.paused) {
        this.currentAudio.pause();
      }
      return;
    }

    if (this.isBrowserSpeechSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      ambientAudioManager.setDucked(false);
      this.emit({
        speaking: true,
        paused: true,
        loading: false,
        provider: 'browser',
      });
    }
  }

  public resume(): void {
    this.isSequencePaused = false;
    if (this.resumeWaiter) {
      this.resumeWaiter();
      this.resumeWaiter = null;
    }

    if (this.activeProvider === 'sarvam' && this.currentAudio) {
      if (this.currentAudio.paused) {
        void this.currentAudio.play();
      }
      return;
    }

    if (this.isBrowserSpeechSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      ambientAudioManager.setDucked(true);
      this.emit({
        speaking: true,
        paused: false,
        loading: false,
        provider: 'browser',
      });
    }
  }

  public stop(): void {
    this.runToken++;
    this.isSequencePaused = false;

    if (this.resumeWaiter) {
      this.resumeWaiter();
      this.resumeWaiter = null;
    }

    if (this.activeSegmentResolve) {
      const resolve = this.activeSegmentResolve;
      this.activeSegmentResolve = null;
      resolve('cancelled');
    }

    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.cleanupAudioElement();
    if (this.isBrowserSpeechSupported()) {
      window.speechSynthesis.cancel();
    }

    ambientAudioManager.setDucked(false);
    this.currentUtterance = null;
    this.activeSegmentId = null;
    this.activeSegmentLabel = null;
    this.segmentIndex = 0;
    this.totalSegments = 0;

    this.emit({
      speaking: false,
      paused: false,
      loading: false,
      provider: this.sarvamAvailable ? 'sarvam' : 'browser',
    });
  }
}

export const speechController = new GujaratiSpeechController();
