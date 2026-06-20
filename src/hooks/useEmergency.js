import { useLocalStorage } from './useLocalStorage';

export const useEmergency = () => {
  const [emergencyContacts, setEmergencyContacts] = useLocalStorage('nanna_emergency_contacts', []);

  const addEmergencyContact = (contact) => {
    setEmergencyContacts(prev => [
      { id: Date.now().toString(), isPrimary: false, isSecondary: false, ...contact },
      ...(Array.isArray(prev) ? prev : [])
    ]);
  };

  const updateEmergencyContact = (id, updatedData) => {
    setEmergencyContacts(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.map(c => c.id === id ? { ...c, ...updatedData } : c);
    });
  };

  const removeEmergencyContact = (id) => {
    setEmergencyContacts(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.filter(c => c.id !== id);
    });
  };

  const setPrimary = (id) => {
    setEmergencyContacts(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.map(c => ({
        ...c,
        isPrimary: c.id === id,
        // If it's becoming primary, it can't be secondary
        isSecondary: c.id === id ? false : c.isSecondary
      }));
    });
  };

  const setSecondary = (id) => {
    setEmergencyContacts(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.map(c => ({
        ...c,
        isSecondary: c.id === id,
        // If it's becoming secondary, it can't be primary
        isPrimary: c.id === id ? false : c.isPrimary
      }));
    });
  };

  const getPrimaryContact = () => {
    const arr = Array.isArray(emergencyContacts) ? emergencyContacts : [];
    return arr.find(c => c.isPrimary) || null;
  };

  const getSecondaryContact = () => {
    const arr = Array.isArray(emergencyContacts) ? emergencyContacts : [];
    return arr.find(c => c.isSecondary) || null;
  };

  // Default non-deletable services
  const defaultServices = [
    { id: 'police', name: 'Police', phone: '112', icon: '🚓', type: 'default' },
    { id: 'ambulance', name: 'Ambulance', phone: '108', icon: '🚑', type: 'default' },
    { id: 'fire', name: 'Fire Service', phone: '101', icon: '🚒', type: 'default' },
    { id: 'hospital', name: 'Hospital', phone: '108', icon: '🏥', type: 'default' }
  ];

  return {
    emergencyContacts: Array.isArray(emergencyContacts) ? emergencyContacts : [],
    defaultServices,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    setPrimary,
    setSecondary,
    getPrimaryContact,
    getSecondaryContact
  };
};
