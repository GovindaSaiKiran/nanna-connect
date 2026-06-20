import { useLocalStorage } from './useLocalStorage';

export const useNotes = () => {
  const [notes, setNotes] = useLocalStorage('nanna_notes', []);

  const addNote = (text) => {
    setNotes(prev => {
      return [
        { id: Date.now().toString(), text, date: new Date().toISOString(), pinned: false },
        ...(Array.isArray(prev) ? prev : [])
      ];
    });
  };

  const removeNote = (id) => {
    setNotes(prev => (Array.isArray(prev) ? prev : []).filter(n => n.id !== id));
  };

  const togglePin = (id) => {
    setNotes(prev => {
      const newNotes = (Array.isArray(prev) ? prev : []).map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
      // Sort pinned to top
      return newNotes.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.date) - new Date(a.date);
        }
        return a.pinned ? -1 : 1;
      });
    });
  };

  const searchNotes = (query) => {
    if (!query) return (Array.isArray(notes) ? notes : []);
    const lowerQuery = query.toLowerCase();
    return (Array.isArray(notes) ? notes : []).filter(n => n?.text?.toLowerCase().includes(lowerQuery));
  };

  const getPinnedNotes = () => {
    return (Array.isArray(notes) ? notes : []).filter(n => n.pinned).slice(0, 3);
  };

  return { notes, addNote, removeNote, togglePin, searchNotes, getPinnedNotes };
};
