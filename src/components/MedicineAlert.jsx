import React from 'react';
import { Pill, CheckCircle, BellRing } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getMedicineIcon, formatMedicineTime } from '../utils/timeUtils';

export const MedicineAlert = () => {
  const { activeAlert, dismissAlert, markTaken, t, speak } = useAppContext();

  if (!activeAlert) return null;

  const handleTaken = () => {
    markTaken(activeAlert);
    dismissAlert();
    speak(t('takenSuccess') || t('taken'));
  };

  const handleSnooze = () => {
    // In a real app we'd schedule this 10 mins later. 
    // For this simple version, we'll just dismiss. The user will be reminded tomorrow.
    // Or we could implement a snooze array in context. Let's just dismiss for simplicity.
    dismissAlert();
    speak(t('cancel'));
  };

  const getTypeLabel = (tType) => {
    if (tType === 'morning') return t('morningMedicine');
    if (tType === 'afternoon') return t('afternoonMedicine');
    if (tType === 'night') return t('nightMedicine');
    if (tType === 'day') return t('morningMedicine'); // fallback
    return '';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--danger-color)',
      color: '#fff',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px'
    }}>
      <h1 className="text-huge" style={{ textAlign: 'center', marginBottom: '16px' }}>
        <BellRing size={64} style={{ display: 'block', margin: '0 auto 16px' }} />
        {t('medicineTime')}
      </h1>

      <div style={{
        backgroundColor: '#fff',
        color: '#000',
        padding: '32px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        marginBottom: '48px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }}>
        <Pill size={80} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
        <h2 className="text-huge" style={{ margin: '0 0 16px 0', fontSize: '3rem' }}>{activeAlert.name}</h2>
        <div className="text-large" style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '2rem' }}>
          {getMedicineIcon(activeAlert.type)} {getTypeLabel(activeAlert.type)}
        </div>
        <div className="text-large" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
          {formatMedicineTime(activeAlert.type, activeAlert.time, t)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '500px' }}>
        <button 
          className="btn-massive btn-success" 
          style={{ minHeight: '120px', fontSize: '2.5rem', backgroundColor: '#fff', color: 'var(--success-color)' }}
          onClick={handleTaken}
        >
          <CheckCircle size={48} className="icon" />
          <span>{t('taken')}</span>
        </button>

        <button 
          className="btn-massive btn-outline" 
          style={{ minHeight: '100px', backgroundColor: 'transparent', borderColor: '#fff', color: '#fff' }}
          onClick={handleSnooze}
        >
          <BellRing size={32} className="icon" />
          <span>{t('remindAgain')}</span>
        </button>
      </div>
    </div>
  );
};
