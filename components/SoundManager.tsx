'use client';

import { useEffect, useRef } from 'react';

interface SoundManagerProps {
  enabled?: boolean;
}

const SoundManager: React.FC<SoundManagerProps> = ({ enabled = false }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<{ [key: string]: AudioBuffer }>({});

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize Web Audio API
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create simple sound effects using oscillators
        const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
          if (!audioContextRef.current) return;
          
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
          
          oscillator.start(audioContextRef.current.currentTime);
          oscillator.stop(audioContextRef.current.currentTime + duration);
        };

        // Sound effects for different interactions
        const playScrollSound = () => createTone(220, 0.1, 'sine');
        const playHoverSound = () => createTone(440, 0.05, 'triangle');
        const playClickSound = () => createTone(880, 0.1, 'square');

        // Add scroll sound effect
        let lastScrollTime = 0;
        const handleScroll = () => {
          const now = Date.now();
          if (now - lastScrollTime > 100) { // Throttle
            playScrollSound();
            lastScrollTime = now;
          }
        };

        // Add hover sound effects
        const addHoverSounds = () => {
          const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
          interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', playHoverSound);
            element.addEventListener('click', playClickSound);
          });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        addHoverSounds();

        // Re-add sounds for dynamically created elements
        const observer = new MutationObserver(addHoverSounds);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
          window.removeEventListener('scroll', handleScroll);
          observer.disconnect();
        };
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    };

    // Initialize on user interaction (required by browsers)
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [enabled]);

  return null;
};

export default SoundManager;