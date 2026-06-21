import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeechRecognition = (language, options = {}) => {
  const { continuous = false } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const clearTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  };

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    clearTimers();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = continuous;
      recognition.interimResults = true; // Always true for live preview
      recognition.lang = language || 'en-IN'; 

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        clearTimers();
        if (continuous) {
          silenceTimerRef.current = setTimeout(() => {
            stopListening();
          }, 4000);
        }

        let finalTrans = '';
        let interimTrans = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }
        
        setInterimTranscript(interimTrans);
        
        if (finalTrans) {
          if (continuous) {
            setTranscript(prev => prev + ' ' + finalTrans);
          } else {
            setTranscript(finalTrans);
            setIsListening(false);
          }
        }
      };

      recognition.onerror = (event) => {
        let msg = event.error;
        if (event.error === 'no-speech') msg = 'No speech detected. Please try again.';
        if (event.error === 'not-allowed') msg = 'Microphone permission denied.';
        if (event.error === 'network') msg = 'Network error. Please check your connection.';
        setError(msg);
        setIsListening(false);
        clearTimers();
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        clearTimers();
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setError('Error initializing speech recognition');
    }

    return () => {
      clearTimers();
      setIsListening(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [language, continuous, stopListening]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        resetTranscript();
        recognitionRef.current.start();
      } catch (err) {
        // Ignore if already started
      }
    }
  }, [resetTranscript]);

  return { isListening, transcript, interimTranscript, error, startListening, stopListening, resetTranscript, setTranscript };
};
