/**
 * Audio manager for Happy Birthday celebration track (/audio/happy-birthday.mp3).
 * Safely handles browser autoplay policies, user gesture unlocking,
 * event listeners cleanup, and error fallbacks.
 */

class BirthdayAudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentEndedListener: (() => void) | null = null;
  private currentErrorListener: (() => void) | null = null;

  /**
   * Pre-primes the audio element during a user touch/click gesture.
   * This guarantees that iOS Safari, Chrome, and modern browsers permit playback
   * even if playback starts a few hundred milliseconds later after the blow effect.
   */
  public prepareAudio() {
    try {
      if (!this.audio) {
        this.audio = new Audio("/audio/happy-birthday.mp3");
        this.audio.preload = "auto";
      }
      this.audio.load();
    } catch {
      // Audio prep error safety
    }
  }

  /**
   * Plays the Happy Birthday audio file.
   * Listens for the natural 'ended' event to notify completion.
   */
  public play(
    isMuted: boolean,
    onEnded: () => void,
    onError: () => void
  ): HTMLAudioElement | null {
    try {
      this.stop();

      if (!this.audio) {
        this.audio = new Audio("/audio/happy-birthday.mp3");
        this.audio.preload = "auto";
      }

      this.audio.currentTime = 0;
      this.audio.muted = isMuted;

      const handleEnded = () => {
        this.removeListeners();
        onEnded();
      };

      const handleError = () => {
        this.removeListeners();
        onError();
      };

      this.currentEndedListener = handleEnded;
      this.currentErrorListener = handleError;

      this.audio.addEventListener("ended", handleEnded, { once: true });
      this.audio.addEventListener("error", handleError, { once: true });

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Playback blocked or missing file
          handleError();
        });
      }

      return this.audio;
    } catch {
      onError();
      return null;
    }
  }

  /**
   * Dynamically updates the muted state during playback
   */
  public setMuted(muted: boolean) {
    if (this.audio) {
      this.audio.muted = muted;
    }
  }

  /**
   * Stops playback and resets position
   */
  public stop() {
    this.removeListeners();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  /**
   * Complete teardown
   */
  public cleanup() {
    this.stop();
    this.audio = null;
  }

  private removeListeners() {
    if (this.audio) {
      if (this.currentEndedListener) {
        this.audio.removeEventListener("ended", this.currentEndedListener);
        this.currentEndedListener = null;
      }
      if (this.currentErrorListener) {
        this.audio.removeEventListener("error", this.currentErrorListener);
        this.currentErrorListener = null;
      }
    }
  }
}

export const birthdayAudio = new BirthdayAudioManager();
