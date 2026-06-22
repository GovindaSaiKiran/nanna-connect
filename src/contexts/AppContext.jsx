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

  // Medicine Alert Polling & Debug Info
  const [activeAlert, setActiveAlert] = useState(null);
  const [snoozedAlerts, setSnoozedAlerts] = useState({});
  const [debugInfo, setDebugInfo] = useState({
    currentTime: '',
    nextReminder: '',
    timeRemaining: '',
    reminderTriggered: false,
    notificationSent: false,
    voicePlayed: false
  });
  
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    const checkMedicines = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      const todayString = now.toDateString();
      
      const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMins.toString().padStart(2, '0')}`;
      
      let nextRem = null;
      let minDiff = Infinity;
      
      // Update basic debug info
      setDebugInfo(prev => ({ ...prev, currentTime: currentTimeStr }));

      medicinesHook.medicines.forEach(m => {
        // Calculate debug next reminder
        if (m.time >= currentTimeStr) {
          const [mH, mM] = m.time.split(':').map(Number);
          const diff = (mH * 60 + mM) - (currentHours * 60 + currentMins);
          if (diff < minDiff) {
            minDiff = diff;
            nextRem = m.time;
          }
        }
        
        // 1. Check for missed medicines (triggered > 30 mins ago, not taken)
        if (m.lastTriggeredDate) {
          const triggerDate = new Date(m.lastTriggeredDate);
          const diffMins = Math.floor((now - triggerDate) / 60000);
          if (diffMins > 30 && m.lastTakenDate !== todayString && m.lastMissedDate !== todayString) {
            medicinesHook.markMissed(m);
            return;
          }
        }

        // 2. Check for trigger
        let triggerTime = m.time;
        // Check if snoozed
        if (snoozedAlerts[m.id]) {
          triggerTime = snoozedAlerts[m.id];
        }

        if (currentTimeStr >= triggerTime && m.lastTakenDate !== todayString && m.lastMissedDate !== todayString) {
          // It's due! But did we already trigger it today (and not snooze)?
          // If it's snoozed, it will trigger again when currentTime >= snoozeTime
          const isSnoozedDue = snoozedAlerts[m.id] && currentTimeStr >= snoozedAlerts[m.id];
          const isNormalDue = !m.lastTriggeredDate || (new Date(m.lastTriggeredDate).toDateString() !== todayString);

          if (isNormalDue || isSnoozedDue) {
            if (!activeAlert || activeAlert.id !== m.id) {
              setActiveAlert(m);
              medicinesHook.setTriggered(m.id);
              
              if (isSnoozedDue) {
                setSnoozedAlerts(prev => {
                  const newS = { ...prev };
                  delete newS[m.id];
                  return newS;
                });
              }

              // Build Voice Announcement
              let template = t('voiceTemplate_reminder');
              if (!m.dosage && t('voiceTemplate_reminder_no_dosage')) {
                template = t('voiceTemplate_reminder_no_dosage');
              }
              
              let periodKey = 'morning';
              if (m.type === 'afternoon') periodKey = 'afternoon';
              if (m.type === 'evening') periodKey = 'evening';
              if (m.type === 'night') periodKey = 'night';
              
              const announcement = template
                .replace('{period}', t(periodKey))
                .replace('{medicine}', m.name)
                .replace('{dosage}', m.dosage || '');
              
              speakFeedback(announcement);
              setDebugInfo(prev => ({ 
                ...prev, 
                reminderTriggered: true, 
                notificationSent: true, 
                voicePlayed: voiceGuidance 
              }));

              // Web Notification Fallback
              if (window.Notification && Notification.permission === 'granted') {
                new Notification('💊 ' + t('medicineReminder'), {
                  body: `${m.name} - ${m.dosage || ''}\n${t('medicineTime')}`
                });
              }
            }
          }
        }
      });
      
      setDebugInfo(prev => ({ 
        ...prev, 
        nextReminder: nextRem || 'None',
        timeRemaining: minDiff !== Infinity ? `${minDiff} min` : 'N/A'
      }));
    };

    checkMedicines();
    checkIntervalRef.current = setInterval(checkMedicines, 10000); // 10 seconds

    return () => clearInterval(checkIntervalRef.current);
  }, [medicinesHook.medicines, activeAlert, speak, t, snoozedAlerts, voiceGuidance]);

  const dismissAlert = () => setActiveAlert(null);
  
  const snoozeAlert = () => {
    if (activeAlert) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10);
      const snoozeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setSnoozedAlerts(prev => ({ ...prev, [activeAlert.id]: snoozeStr }));
      dismissAlert();
    }
  };

  const [commandHistory, setCommandHistory] = useState(() => {
    try {
      const stored = window.localStorage.getItem('nanna_cmd_history');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  });

  const logVoiceCommand = (text) => {
    if (!text) return;
    setCommandHistory(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const updated = [{ id: Date.now().toString(), text, timestamp: new Date().toISOString() }, ...arr].slice(0, 50); // Keep last 50
      try {
        window.localStorage.setItem('nanna_cmd_history', JSON.stringify(updated));
      } catch(e) {}
      return updated;
    });
  };

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
      dismissAlert,
      snoozeAlert,
      debugInfo,
      commandHistory,
      logVoiceCommand
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
