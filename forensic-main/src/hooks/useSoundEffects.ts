'use client';

import { useCallback, useRef } from 'react';

type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext };

export function useSoundEffects() {
    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current && typeof window !== 'undefined') {
            const w = window as WindowWithAudio;
            const Ctor = window.AudioContext ?? w.webkitAudioContext;
            if (Ctor) {
                audioContextRef.current = new Ctor();
            }
        }
        return audioContextRef.current;
    }, []);

    const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) => {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch {
            // Audio not supported, silently fail
        }
    }, [getAudioContext]);

    const playNotification = useCallback(() => {
        playTone(880, 0.15, 'sine', 0.08);
        setTimeout(() => playTone(1100, 0.2, 'sine', 0.06), 150);
    }, [playTone]);

    const playSuccess = useCallback(() => {
        playTone(523, 0.1, 'sine', 0.08);
        setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 100);
        setTimeout(() => playTone(784, 0.2, 'sine', 0.06), 200);
    }, [playTone]);

    const playError = useCallback(() => {
        playTone(300, 0.15, 'square', 0.06);
        setTimeout(() => playTone(250, 0.3, 'square', 0.04), 150);
    }, [playTone]);

    const playClick = useCallback(() => {
        playTone(600, 0.05, 'sine', 0.05);
    }, [playTone]);

    const playMessage = useCallback(() => {
        playTone(700, 0.08, 'sine', 0.06);
        setTimeout(() => playTone(900, 0.12, 'sine', 0.05), 80);
    }, [playTone]);

    return { playNotification, playSuccess, playError, playClick, playMessage };
}
