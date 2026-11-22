/**
 * Web Audio API synthesizer for 'A Little Birthday Magic'
 * Generates custom synthesized sounds with zero external assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicBoxInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    // Read saved mute preference
    try {
      const saved = localStorage.getItem("birthday_magic_muted");
      if (saved !== null) {
        this.isMuted = saved === "true";
      }
    } catch {
      // localStorage may fail in some environments
    }
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem("birthday_magic_muted", String(muted));
    } catch {
      // ignore
    }
    if (muted) {
      this.stopMusicBox();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Sound: Gift Box Unwrapping / Pop
   */
  public playPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const now = ctx.currentTime;

      // Frequency drop for a cute cork/bubble pop
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio fail safety
    }
  }

  /**
   * Sound: Candle Extinguish / Soft Puff of Wind
   */
  public playPuff() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // White noise buffer for wind/breath puff
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to simulate soft breath
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.26);
    } catch {
      // Audio fail safety
    }
  }

  /**
   * Sound: Magical Sparkles & Glissando Chime
   */
  public playChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      const now = ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.46);
      });
    } catch {
      // Audio fail safety
    }
  }

  /**
   * Sound: Joyous Fanfare / Celebration Chords
   */
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Strummed celebratory chord: C major to G to high C
      const chords = [
        { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.3 },
        { notes: [587.33, 739.99, 880.0], time: 0.25, dur: 0.3 },
        { notes: [659.25, 830.61, 987.77], time: 0.5, dur: 0.35 },
        { notes: [783.99, 987.77, 1046.5, 1318.51], time: 0.8, dur: 0.9 },
      ];

      chords.forEach((chord) => {
        chord.notes.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          const start = now + chord.time;
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.14, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, start + chord.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + chord.dur + 0.05);
        });
      });
    } catch {
      // Audio fail safety
    }
  }

  /**
   * Plays a delicate, music-box style Happy Birthday melody
   */
  public playMusicBox() {
    if (this.isMuted || this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;

    // Happy Birthday notes: [freq, relative length in beats]
    // C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25, etc.
    const melody = [
      { note: 392.0, beats: 0.75 }, // G4
      { note: 392.0, beats: 0.25 }, // G4
      { note: 440.0, beats: 1.0 },  // A4
      { note: 392.0, beats: 1.0 },  // G4
      { note: 523.25, beats: 1.0 }, // C5
      { note: 493.88, beats: 2.0 }, // B4

      { note: 392.0, beats: 0.75 }, // G4
      { note: 392.0, beats: 0.25 }, // G4
      { note: 440.0, beats: 1.0 },  // A4
      { note: 392.0, beats: 1.0 },  // G4
      { note: 587.33, beats: 1.0 }, // D5
      { note: 523.25, beats: 2.0 }, // C5

      { note: 392.0, beats: 0.75 }, // G4
      { note: 392.0, beats: 0.25 }, // G4
      { note: 783.99, beats: 1.0 }, // G5
      { note: 659.25, beats: 1.0 }, // E5
      { note: 523.25, beats: 1.0 }, // C5
      { note: 493.88, beats: 1.0 }, // B4
      { note: 440.0, beats: 1.5 },  // A4

      { note: 698.46, beats: 0.75 }, // F5
      { note: 698.46, beats: 0.25 }, // F5
      { note: 659.25, beats: 1.0 },  // E5
      { note: 523.25, beats: 1.0 },  // C5
      { note: 587.33, beats: 1.0 },  // D5
      { note: 523.25, beats: 2.5 },  // C5
    ];

    const beatDuration = 0.42; // seconds per beat
    let timeOffset = 0;

    melody.forEach((item) => {
      const noteTime = timeOffset;
      timeOffset += item.beats * beatDuration;

      const schedule = () => {
        if (!this.isMusicPlaying || this.isMuted) return;
        const currentCtx = this.getContext();
        if (!currentCtx) return;

        try {
          const osc = currentCtx.createOscillator();
          const gain = currentCtx.createGain();

          // Celesta/music box timbre (sine with quick decay)
          osc.type = "sine";
          osc.frequency.setValueAtTime(item.note, currentCtx.currentTime);

          gain.gain.setValueAtTime(0.12, currentCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, currentCtx.currentTime + item.beats * beatDuration * 0.9);

          osc.connect(gain);
          gain.connect(currentCtx.destination);

          osc.start();
          osc.stop(currentCtx.currentTime + item.beats * beatDuration);
        } catch {
          // ignore
        }
      };

      window.setTimeout(schedule, noteTime * 1000);
    });

    // Total song duration
    const totalDurationMs = timeOffset * 1000 + 1000;
    this.musicBoxInterval = window.setTimeout(() => {
      this.isMusicPlaying = false;
    }, totalDurationMs);
  }

  public stopMusicBox() {
    this.isMusicPlaying = false;
    if (this.musicBoxInterval) {
      window.clearTimeout(this.musicBoxInterval);
      this.musicBoxInterval = null;
    }
  }
}

export const sound = new SoundEngine();
