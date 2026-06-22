import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

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

  const activeContacts = (Array.isArray(contacts) ? contacts : [])
    .filter(c => !c.isDeleted)
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

  const addContact = (contact) => {
    setContacts((prev) => {
      return [...(Array.isArray(prev) ? prev : []), { id: Date.now().toString(), ...contact }];
    });
  };

  const updateContact = (id, updatedContact) => {
    setContacts(prev => {
      return (Array.isArray(prev) ? prev : []).map(c => 
        c.id === id ? { ...c, ...updatedContact } : c
      );
    });
  };

  const removeContact = (id) => {
    setContacts(prev => (Array.isArray(prev) ? prev : []).map(c => 
      c.id === id ? { ...c, isDeleted: true, deletedAt: Date.now() } : c
    ));
  };

  const toggleFavorite = (id) => {
    setContacts(prev => (Array.isArray(prev) ? prev : []).map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const exportContacts = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeContacts));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "nanna_contacts_backup.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importContacts = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!Array.isArray(imported)) throw new Error("Invalid format");
          
          setContacts(prev => {
            const current = Array.isArray(prev) ? prev : [];
            // Merge logic based on ID or Name+Number to prevent pure duplicates
            const merged = [...current];
            imported.forEach(ic => {
               if (!merged.find(c => c.number === ic.number && c.name === ic.name)) {
                 merged.push({ ...ic, id: Date.now().toString() + Math.random().toString() });
               }
            });
            return merged;
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  return { 
    contacts: activeContacts, 
    allContacts: contacts, 
    addContact, 
    updateContact, 
    removeContact,
    toggleFavorite,
    exportContacts,
    importContacts
  };
};
