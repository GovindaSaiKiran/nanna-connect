import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeechRecognition = (language) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Fallback logic, but since language string is just passed to API, 
      // the browser will fallback to default if it doesn't support the exact dialect.
      recognition.lang = language || 'en-IN'; 

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setError('Error initializing speech recognition');
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (err) {
        // Recognition already started or error occurred, fail silently
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, []);

  return { isListening, transcript, error, startListening, stopListening, setTranscript };
};
