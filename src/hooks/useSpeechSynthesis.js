import { useCallback, useState, useEffect, useRef } from 'react';

export const useSpeechSynthesis = (language) => {
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        voicesRef.current = v;
        setVoicesLoaded(true);
      }
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) {
      return;
    }
    
    try {
      window.speechSynthesis.cancel();
      
      // Delay speech slightly to allow cancel to process completely
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        const targetLang = language || 'en-IN';
        const availableVoices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
        
        let matchedVoice = availableVoices.find(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang);
        
        if (!matchedVoice) {
          const shortLang = targetLang.substring(0, 2);
          matchedVoice = availableVoices.find(v => v.lang.startsWith(shortLang));
        }
        
        if (!matchedVoice) {
          matchedVoice = availableVoices.find(v => v.lang.startsWith('en'));
        }
        
        if (!matchedVoice && availableVoices.length > 0) {
          matchedVoice = availableVoices[0];
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
      }, 50);
    } catch (e) {
      console.error("Speech synthesis failed:", e);
    }
  }, [language]);

  const stop = useCallback(() => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }, []);

  return { speak, stop, voicesLoaded };
};
