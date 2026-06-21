import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { fuzzyMatchScore } from '../utils/fuzzyMatch';
import { transliterate } from '../services/transliterationEngine';

export const useContacts = () => {
  const [contacts, setContacts] = useLocalStorage('nanna_contacts', []);

  // Soft delete purge logic
  useEffect(() => {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    setContacts(prev => {
      if (!Array.isArray(prev)) return [];
      let changed = false;
      const next = prev.filter(c => {
        if (c.isDeleted && c.deletedAt && (now - c.deletedAt > thirtyDays)) {
          changed = true;
          return false;
        }
        return true;
      });
      return changed ? next : prev;
    });
  }, [setContacts]);

  const activeContacts = (Array.isArray(contacts) ? contacts : []).filter(c => !c.isDeleted);

  const addContact = (contact) => {
    console.log('[useContacts] Adding Contact:', contact);
    setContacts((prev) => {
      return [...(Array.isArray(prev) ? prev : []), { id: Date.now().toString(), ...contact }];
    });
  };

  const updateContact = (id, updatedContact) => {
    console.log('[useContacts] Updating Contact:', id, updatedContact);
    setContacts(prev => {
      return (Array.isArray(prev) ? prev : []).map(c => 
        c.id === id ? { ...c, ...updatedContact } : c
      );
    });
  };

  const removeContact = (id) => {
    console.log('[useContacts] Removing Contact:', id);
    setContacts(prev => (Array.isArray(prev) ? prev : []).map(c => 
      c.id === id ? { ...c, isDeleted: true, deletedAt: Date.now() } : c
    ));
  };

  return { contacts: activeContacts, allContacts: contacts, addContact, updateContact, removeContact };
};
