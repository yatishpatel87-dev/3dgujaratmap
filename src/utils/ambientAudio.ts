export type AmbientSoundscapeId = 'focus' | 'breeze' | 'tanpura' | 'rain';

export interface AmbientSoundscapeMeta {
  id: AmbientSoundscapeId;
  labelGu: string;
  labelEn: string;
}

export const AMBIENT_SOUNDSCAPES: AmbientSoundscapeMeta[] = [
  { id: 'focus', labelGu: 'શાંત અભ્યાસ નાદ', labelEn: 'Calm Classroom Focus' },
  { id: 'breeze', labelGu: 'દરિયાઈ હળવો પવન', labelEn: 'Coastal Breeze' },
  { id: 'tanpura', labelGu: 'હળવો શાસ્ત્રીય નાદ', labelEn: 'Gentle Classical Drone' },
  { id: 'rain', labelGu: 'હળવો ચોમાસુ વરસાદ', labelEn: 'Light Monsoon Rain' },
];

class ClassroomAmbientAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeSources: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private currentSoundscape: AmbientSoundscapeId = 'focus';
  private enabled = false;
  private volume = 0.28;
  private ducked = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.duckGain = this.ctx.createGain();
      this.duckGain.gain.value = this.ducked ? 0.25 : 1.0;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0;

      this.masterGain.connect(this.duckGain);
      this.duckGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private clearActiveGraph(): void {
    for (const src of this.activeSources) {
      try {
        src.stop();
      } catch {
        // Ignore already stopped sources
      }
      try {
        src.disconnect();
      } catch {
        // Ignore
      }
    }
    for (const node of this.activeNodes) {
      try {
        node.disconnect();
      } catch {
        // Ignore
      }
    }
    this.activeSources = [];
    this.activeNodes = [];
  }

  private createSoftNoiseBuffer(ctx: AudioContext, seconds: number, brownian: boolean): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (brownian) {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 2.4;
      } else {
        lastOut = lastOut * 0.85 + white * 0.15;
        data[i] = lastOut * 1.1;
      }
    }
    return buffer;
  }

  private buildSoundscape(ctx: AudioContext, id: AmbientSoundscapeId): void {
    this.clearActiveGraph();
    if (!this.masterGain) return;

    if (id === 'focus') {
      // Warm low-level C-major / fifth harmonic pad with subtle LFO breathing
      const freqs = [130.81, 196.0, 261.63];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 460;
      filter.connect(this.masterGain);
      this.activeNodes.push(filter);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.09;
      lfoGain.gain.value = 90;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.activeSources.push(lfo);
      this.activeNodes.push(lfoGain);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        g.gain.value = idx === 0 ? 0.16 : idx === 1 ? 0.09 : 0.06;
        osc.connect(g);
        g.connect(filter);
        osc.start();
        this.activeSources.push(osc);
        this.activeNodes.push(g);
      });
    } else if (id === 'tanpura') {
      // Gentle Indian classical Sa - Pa - Sa drone (C#3 - G#3 - C#4) softened through lowpass
      const freqs = [138.59, 207.65, 277.18];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      filter.Q.value = 0.7;
      filter.connect(this.masterGain);
      this.activeNodes.push(filter);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        osc.detune.value = idx === 2 ? 3 : 0;
        g.gain.value = idx === 0 ? 0.11 : 0.08;

        // Gentle slow pulse modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.14 + idx * 0.05;
        lfoGain.gain.value = 0.02;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start();

        osc.connect(g);
        g.connect(filter);
        osc.start();
        this.activeSources.push(osc, lfo);
        this.activeNodes.push(g, lfoGain);
      });
    } else if (id === 'breeze') {
      // Gentle coastal sea breeze using smoothed brown noise + slow tidal LFO
      const noiseBuf = this.createSoftNoiseBuffer(ctx, 4, true);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 340;
      filter.Q.value = 0.9;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.11;
      lfoGain.gain.value = 140;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const gain = ctx.createGain();
      gain.gain.value = 0.34;

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      src.start();
      lfo.start();
      this.activeSources.push(src, lfo);
      this.activeNodes.push(filter, lfoGain, gain);
    } else if (id === 'rain') {
      // Soft warm monsoon rain texture
      const noiseBuf = this.createSoftNoiseBuffer(ctx, 4, false);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1100;

      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 240;

      const gain = ctx.createGain();
      gain.gain.value = 0.24;

      src.connect(hp);
      hp.connect(lp);
      lp.connect(gain);
      gain.connect(this.masterGain);

      src.start();
      this.activeSources.push(src);
      this.activeNodes.push(hp, lp, gain);
    }
  }

  public syncState(enabled: boolean, soundscape: AmbientSoundscapeId, volume: number): void {
    const soundChanged = this.currentSoundscape !== soundscape;
    this.enabled = enabled;
    this.currentSoundscape = soundscape;
    this.volume = Math.max(0, Math.min(1, volume));

    if (!enabled) {
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0, now + 0.35);
      }
      return;
    }

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    if (this.activeSources.length === 0 || soundChanged) {
      this.buildSoundscape(ctx, soundscape);
    }

    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.68, now + 0.45);
  }

  public setDucked(ducked: boolean): void {
    this.ducked = ducked;
    if (!this.ctx || !this.duckGain) return;
    const now = this.ctx.currentTime;
    this.duckGain.gain.cancelScheduledValues(now);
    this.duckGain.gain.setValueAtTime(this.duckGain.gain.value, now);
    this.duckGain.gain.linearRampToValueAtTime(ducked ? 0.22 : 1.0, now + 0.25);
  }

  public dispose(): void {
    this.clearActiveGraph();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
    this.masterGain = null;
    this.duckGain = null;
  }
}

export const ambientAudioManager = new ClassroomAmbientAudioManager();
