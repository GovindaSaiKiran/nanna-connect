import { useCallback, useState, useEffect } from 'react';

export const useSpeechSynthesis = (language) => {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      return;
    }
    
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const targetLang = language || 'en-IN';
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Try exact match
      let matchedVoice = availableVoices.find(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang);
      
      // Try language prefix match
      if (!matchedVoice) {
        const shortLang = targetLang.substring(0, 2);
        matchedVoice = availableVoices.find(v => v.lang.startsWith(shortLang));
      }
      
      // Try English fallback
      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v => v.lang.startsWith('en'));
      }
      
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Silent error as requested
    }
  }, [language]);

  const stop = useCallback(() => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }, []);

  return { speak, stop };
};
