import { useLocalStorage } from './useLocalStorage';

export const useMedicines = () => {
  const [medicines, setMedicines] = useLocalStorage('nanna_medicines', []);
  const [history, setHistory] = useLocalStorage('nanna_medicine_history', []);

  const addMedicine = (medicine) => {
    setMedicines(prev => [
      { id: Date.now().toString(), ...medicine },
      ...(Array.isArray(prev) ? prev : [])
    ]);
  };

  const updateMedicine = (id, updatedData) => {
    setMedicines(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.map(m => m.id === id ? { ...m, ...updatedData } : m);
    });
  };

  const deleteMedicine = (id) => {
    setMedicines(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.filter(m => m.id !== id);
    });
  };

  const markTaken = (medicine) => {
    setHistory(prev => [
      {
        id: Date.now().toString(),
        medicineId: medicine.id,
        name: medicine.name,
        type: medicine.type,
        dosage: medicine.dosage,
        scheduledTime: medicine.time,
        takenAt: new Date().toISOString(),
        status: 'taken'
      },
      ...(Array.isArray(prev) ? prev : [])
    ]);

    setMedicines(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const todayString = new Date().toDateString();
      return arr.map(m => m.id === medicine.id ? { ...m, lastTakenDate: todayString, lastTriggeredDate: null } : m);
    });
  };

  const markMissed = (medicine) => {
    setHistory(prev => [
      {
        id: Date.now().toString(),
        medicineId: medicine.id,
        name: medicine.name,
        type: medicine.type,
        dosage: medicine.dosage,
        scheduledTime: medicine.time,
        missedAt: new Date().toISOString(),
        status: 'missed'
      },
      ...(Array.isArray(prev) ? prev : [])
    ]);

    setMedicines(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const todayString = new Date().toDateString();
      return arr.map(m => m.id === medicine.id ? { ...m, lastMissedDate: todayString, lastTriggeredDate: null } : m);
    });
  };

  const setTriggered = (medicineId) => {
    setMedicines(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.map(m => m.id === medicineId ? { ...m, lastTriggeredDate: new Date().toISOString() } : m);
    });
  };

  // Migrate legacy data
  const migratedMedicines = (Array.isArray(medicines) ? medicines : []).map(m => {
    if (m.type === 'day') return { ...m, type: 'morning' };
    return m;
  });

  return { 
    medicines: migratedMedicines, 
    history: Array.isArray(history) ? history : [], 
    addMedicine, 
    updateMedicine, 
    deleteMedicine, 
    markTaken,
    markMissed,
    setTriggered
  };
};
