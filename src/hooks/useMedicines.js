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
    // Record in history
    setHistory(prev => [
      {
        id: Date.now().toString(),
        medicineId: medicine.id,
        name: medicine.name,
        type: medicine.type,
        scheduledTime: medicine.time,
        takenAt: new Date().toISOString()
      },
      ...(Array.isArray(prev) ? prev : [])
    ]);

    // We don't remove it from active medicines because it repeats every day,
    // but we need a way to know it was taken today so the alarm doesn't keep ringing.
    // We update the 'lastTakenDate' on the medicine itself.
    setMedicines(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      const todayString = new Date().toDateString();
      return arr.map(m => m.id === medicine.id ? { ...m, lastTakenDate: todayString } : m);
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
    markTaken 
  };
};
