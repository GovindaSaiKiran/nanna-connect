import { useLocalStorage } from './useLocalStorage';

export const useContacts = () => {
  const [contacts, setContacts] = useLocalStorage('nanna_contacts', []);

  const addContact = (contact) => {
    setContacts((prev) => {
      // Check for duplicate number
      const existingIndex = (Array.isArray(prev) ? prev : []).findIndex(c => c.phone === contact.phone);
      if (existingIndex >= 0) {
        // Update existing
        const newContacts = [...(Array.isArray(prev) ? prev : [])];
        newContacts[existingIndex] = { ...newContacts[existingIndex], ...contact };
        return newContacts;
      }
      return [...(Array.isArray(prev) ? prev : []), { id: Date.now().toString(), ...contact }];
    });
  };

  const removeContact = (id) => {
    setContacts(prev => (Array.isArray(prev) ? prev : []).filter(c => c.id !== id));
  };

  const findContactByVoice = (transcript) => {
    if (!transcript) return null;
    const lowerTranscript = transcript.toLowerCase();
    
    // Exact or partial name match
    const matches = (Array.isArray(contacts) ? contacts : []).filter(c => {
      const lowerName = c.name?.toLowerCase() || '';
      // Simple fuzzy matching: if transcript contains the name or name contains transcript
      return lowerName && (lowerTranscript.includes(lowerName) || lowerName.includes(lowerTranscript));
    });

    if (matches.length > 0) {
      return matches[0]; // For simplicity, return first match. Conflict resolution can be added later if needed.
    }
    return null;
  };

  return { contacts, addContact, removeContact, findContactByVoice };
};
