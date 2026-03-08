import { useState, useCallback, useRef, useEffect } from 'react';

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [speaking]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return { speak, stop, speaking, supported };
}
