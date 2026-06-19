import { useState, useCallback, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    // We want to support both Telugu and English if possible, usually setting lang to 'te-IN' helps
    // But for mixed, maybe we need to let it default or set it when starting. Let's default to 'te-IN'
    recognition.lang = 'te-IN'; 

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

    setRecognitionInstance(recognition);
  }, []);

  const startListening = useCallback(() => {
    if (recognitionInstance) {
      try {
        setTranscript('');
        recognitionInstance.start();
      } catch (err) {
        // Recognition already started
      }
    }
  }, [recognitionInstance]);

  const stopListening = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
  }, [recognitionInstance]);

  return { isListening, transcript, error, startListening, stopListening, setTranscript };
};
