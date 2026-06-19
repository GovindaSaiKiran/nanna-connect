import { useLocalStorage } from './useLocalStorage';

export const useNotes = () => {
  const [notes, setNotes] = useLocalStorage('nanna_notes', []);

  const addNote = (text) => {
    setNotes(prev => [
      { id: Date.now().toString(), text, date: new Date().toISOString(), pinned: false },
      ...prev
    ]);
  };

  const removeNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePin = (id) => {
    setNotes(prev => {
      const newNotes = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
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
    if (!query) return notes;
    const lowerQuery = query.toLowerCase();
    return notes.filter(n => n.text.toLowerCase().includes(lowerQuery));
  };

  const getPinnedNotes = () => {
    return notes.filter(n => n.pinned).slice(0, 3);
  };

  return { notes, addNote, removeNote, togglePin, searchNotes, getPinnedNotes };
};
