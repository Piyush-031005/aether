// A procedural audio system for AETHER
// Generates a deep, mechanical heartbeat without needing external audio files.

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private nextNoteTime = 0;
  private intervalId: number | null = null;
  private tempo = 60; // Beats per minute
  
  // Engine audio nodes
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;

  // Ambience audio nodes
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

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

  // --- NEW: World Ambience Drone ---
  startWorldAmbience() {
    this.init();
    if (!this.ctx || this.droneOsc) return;

    this.droneOsc = this.ctx.createOscillator();
    this.droneGain = this.ctx.createGain();

    this.droneOsc.type = 'sawtooth';
    this.droneOsc.frequency.value = 40; // Very low pitch

    // Route through a lowpass filter to make it sound muffled and huge
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;

    this.droneOsc.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 5); // Fade in over 5s

    this.droneOsc.start();
  }

  // --- NEW: Dynamic Hoverboard Engine ---
  startEngine() {
    this.init();
    if (!this.ctx || this.engineOsc) return;

    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();

    this.engineOsc.type = 'triangle';
    this.engineOsc.frequency.value = 60; // Idle pitch

    this.engineOsc.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.engineGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2); // Fade in

    this.engineOsc.start();
  }

  setEngineSpeed(speedRatio: number) {
    if (!this.ctx || !this.engineOsc || !this.engineGain) return;
    
    // Pitch goes from 60Hz (idle) to 150Hz (max speed)
    const targetFreq = 60 + (speedRatio * 90);
    // Volume goes from 0.05 (idle) to 0.15 (max speed)
    const targetVol = 0.05 + (speedRatio * 0.1);

    // Smoothly ramp to the target values
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    this.engineGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.1);
  }
}

export const audioSystem = new AudioSystem();
