import React, { createContext, useContext } from 'react';
import { useContacts } from '../hooks/useContacts';
import { useNotes } from '../hooks/useNotes';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const contactsHook = useContacts();
  const notesHook = useNotes();
  const { speak, stop } = useSpeechSynthesis();

  return (
    <AppContext.Provider value={{ ...contactsHook, ...notesHook, speak, stopSpeak: stop }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
