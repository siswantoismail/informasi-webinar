/**
 * Audio playback for the webinar waiting screen.
 * The background track is bundled locally and loops until the user pauses it.
 */
import backsoundUrl from "../assets/audio.mp3";

class AmbientSoundEngine {
  private music: HTMLAudioElement;
  private ctx: AudioContext | null = null;

  constructor() {
    this.music = new Audio(backsoundUrl);
    this.music.loop = true;
    this.music.preload = "auto";
    this.music.volume = 0.35;
  }

  public async toggleMusic(): Promise<boolean> {
    if (!this.music.paused) {
      this.stopMusic();
      return false;
    }

    try {
      await this.music.play();
      return true;
    } catch (error) {
      console.error("Musik latar tidak dapat diputar:", error);
      return false;
    }
  }

  public startMusic(): Promise<void> {
    return this.music.play();
  }

  public stopMusic(): void {
    this.music.pause();
    this.music.currentTime = 0;
  }

  public getIsPlaying(): boolean {
    return !this.music.paused;
  }

  // Short celebration chime when the webinar countdown finishes.
  public playCelebrationChime(): void {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx ??= new AudioContextClass();
      if (this.ctx.state === "suspended") void this.ctx.resume();

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((frequency, index) => {
        if (!this.ctx) return;
        const start = now + index * 0.12;
        const oscillator = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.8);
        oscillator.connect(gain);
        gain.connect(this.ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 2);
      });
    } catch (error) {
      console.error("Nada penanda acara tidak dapat diputar:", error);
    }
  }
}

export const soundEngine = new AmbientSoundEngine();
