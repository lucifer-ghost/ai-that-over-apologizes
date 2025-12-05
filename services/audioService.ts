
export class AudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  private async resume() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  playClick() {
    this.resume();
    const ctx = this.getContext();
    const t = ctx.currentTime;
    
    // Create oscillator for click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    // Quick pitch drop
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    // Short envelope
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playApology(isPanic: boolean) {
    this.resume();
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    if (isPanic) {
      // Panic Mode: Dissonant, harsh cluster
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      
      // Tritone/Minor 2nd clash
      osc1.frequency.value = 110; // A2
      osc2.frequency.value = 116.54; // Bb2

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      // Sharp attack, lingering decay
      gainNode.gain.setValueAtTime(0.1, t);
      gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.6);
      osc2.stop(t + 0.6);
    } else {
      // Normal Mode: Melancholic "sad" chord (Minor add9ish)
      // Frequencies for C4, Eb4, G4
      const freqs = [261.63, 311.13, 392.00]; 
      
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(gainNode);
        
        // Staggered entrance
        const attack = t + (i * 0.05);
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.03, attack + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, attack + 1.5);
        
        osc.start(t);
        osc.stop(t + 2);
      });
    }
  }

  playThemeSwitch(toPanic: boolean) {
    this.resume();
    const ctx = this.getContext();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (toPanic) {
      // Power down / Glitch sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.4);
      
      // Modulate pitch for roughness
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 50;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + 0.4);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.4);
    } else {
      // Relief / Ascending chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.3);
      
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.3);
    }

    osc.start(t);
    osc.stop(t + 0.4);
  }
}

export const audioService = new AudioService();
