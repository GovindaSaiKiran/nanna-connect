import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useNotes } from '../hooks/useNotes';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useMedicines } from '../hooks/useMedicines';
import { useEmergency } from '../hooks/useEmergency';
import { getTranslation } from '../i18n';
import { FEATURES } from '../config/featureFlags';

const AppContext = createContext();

const getAutoLanguage = () => {
  try {
    const lang = (window.navigator.language || '').substring(0, 2).toLowerCase();
    switch (lang) {
      case 'te': return 'te-IN';
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      default: return 'en-IN';
    }
  } catch (e) {
    return 'en-IN';
  }
};

export const AppProvider = ({ children }) => {
  const contactsHook = useContacts();
  const notesHook = useNotes();
  const medicinesHook = useMedicines();
  const emergencyHook = useEmergency();
  
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = window.localStorage.getItem('nanna_language');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) { }
    return null; // Null means onboarding is needed
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem('nanna_language', JSON.stringify(lang));
    } catch (e) { }
  };

  const activeLanguage = language || getAutoLanguage();
  
  const t = (key) => getTranslation(activeLanguage, key);

  const { speak, stop } = useSpeechSynthesis(activeLanguage);

  const [voiceGuidance, setVoiceGuidanceState] = useState(() => {
    try {
      const stored = window.localStorage.getItem('nanna_voice_guidance');
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {}
    return true; // Default ON
  });

  const setVoiceGuidance = (value) => {
    setVoiceGuidanceState(value);
    try {
      window.localStorage.setItem('nanna_voice_guidance', JSON.stringify(value));
      if (!value) stop(); // Stop immediately if toggled off
    } catch (e) {}
  };

  const speakFeedback = (text) => {
    if (!FEATURES.VOICE_GUIDANCE) return;
    if (voiceGuidance) {
      speak(text);
    }
  };

  // Medicine Alert Polling
  const [activeAlert, setActiveAlert] = useState(null);
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    const checkMedicines = () => {
      const now = new Date();
      // Format current time to match saved format (e.g., "09:00 AM")
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      
      const ampm = currentHours >= 12 ? 'PM' : 'AM';
      let hours12 = currentHours % 12;
      hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
      const paddedHours = hours12.toString().padStart(2, '0');
      const paddedMins = currentMins.toString().padStart(2, '0');
      
      const timeString = `${paddedHours}:${paddedMins} ${ampm}`;
      const todayString = now.toDateString();

      // Find any medicine matching this time that hasn't been taken today
      const dueMedicine = medicinesHook.medicines.find(m => 
        m.time === timeString && m.lastTakenDate !== todayString
      );

      if (dueMedicine && !activeAlert) {
        setActiveAlert(dueMedicine);
        // We inject the medicine name into the translated template
        const template = t('voiceTemplate_reminder');
        const announcement = template.replace('{medicine}', dueMedicine.name);
        speak(announcement);
      }
    };

    // Check immediately, then every minute
    checkMedicines();
    checkIntervalRef.current = setInterval(checkMedicines, 60000);

    return () => clearInterval(checkIntervalRef.current);
  }, [medicinesHook.medicines, activeAlert, speak, t]);

  const dismissAlert = () => setActiveAlert(null);

  return (
    <AppContext.Provider value={{ 
      ...contactsHook, 
      ...notesHook, 
      ...medicinesHook,
      ...emergencyHook,
      speak, 
      speakFeedback,
      voiceGuidance,
      setVoiceGuidance,
      stopSpeak: stop,
      language: activeLanguage,
      hasCompletedOnboarding: language !== null,
      setLanguage,
      t,
      activeAlert,
      dismissAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
