// A procedural audio system for AETHER
// Generates a deep, mechanical heartbeat without needing external audio files.

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private nextNoteTime = 0;
  private intervalId: number | null = null;
  private tempo = 60; // Beats per minute
  
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // A deep, synthetic kick drum sound resembling a mechanical heartbeat
  private playHeartbeat(time: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // Deep sine wave dropping in pitch (classic kick drum synthesis)
    osc.frequency.setValueAtTime(100, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);

    // Volume envelope
    gainNode.gain.setValueAtTime(1, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  private scheduleNote() {
    if (!this.ctx) return;
    const secondsPerBeat = 60.0 / this.tempo;

    // Double beat (lub-dub)
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.playHeartbeat(this.nextNoteTime);
      this.playHeartbeat(this.nextNoteTime + 0.2); // The "dub"
      this.nextNoteTime += secondsPerBeat;
    }
  }

  startHeartbeat() {
    if (this.isPlaying) return;
    this.init();
    
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isPlaying = true;
    this.nextNoteTime = this.ctx!.currentTime + 0.05;
    
    this.intervalId = window.setInterval(() => this.scheduleNote(), 25);
  }

  stopHeartbeat() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const audioSystem = new AudioSystem();
