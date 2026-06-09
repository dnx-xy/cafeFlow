'use client';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(frequency: number, startTime: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playOrderNotificationSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  playTone(523.25, now, 0.15, 'sine', 0.12);
  playTone(659.25, now + 0.12, 0.15, 'sine', 0.12);
  playTone(783.99, now + 0.24, 0.25, 'sine', 0.15);
}

export function playPaymentNotificationSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  playTone(392, now, 0.12, 'sine', 0.1);
  playTone(523.25, now + 0.1, 0.2, 'sine', 0.12);
}
