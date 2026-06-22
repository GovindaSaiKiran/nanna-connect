import React from 'react';
import { Pill, CheckCircle, BellRing, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { formatMedicineTime } from '../utils/timeUtils';

export const MedicineAlert = () => {
  const { activeAlert, dismissAlert, markTaken, snoozeAlert, t, speak } = useAppContext();

  if (!activeAlert) return null;

  const handleTaken = () => {
    markTaken(activeAlert);
    dismissAlert();
    speak(t('taken') + ' ' + activeAlert.name);
  };

  const handleSnooze = () => {
    snoozeAlert();
    speak(t('remindAgain10') || 'Remind again in 10 minutes');
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
      <h1 className="text-huge" style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '4rem' }}>💊</span>
        {t('medicineReminder')}
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
        <p className="text-medium" style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{t('medicineName')}</p>
        <h2 className="text-huge" style={{ margin: '0 0 24px 0', fontSize: '3.5rem', fontWeight: 'bold' }}>{activeAlert.name}</h2>
        
        {activeAlert.dosage && (
          <>
            <p className="text-medium" style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{t('dosage') || 'Dosage'}</p>
            <div className="text-huge" style={{ fontWeight: 'bold', marginBottom: '24px', color: 'var(--primary-color)' }}>
              {activeAlert.dosage}
            </div>
          </>
        )}

        <p className="text-medium" style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{t('reminderTime')}</p>
        <div className="text-huge" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
          {formatMedicineTime(activeAlert.time, t)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '500px' }}>
        <button 
          className="btn-massive btn-success" 
          style={{ minHeight: '120px', fontSize: '2.5rem', backgroundColor: '#fff', color: 'var(--success-color)', border: 'none' }}
          onClick={handleTaken}
        >
          <CheckCircle size={48} className="icon" />
          <span style={{ fontWeight: 'bold' }}>{t('taken')}</span>
        </button>

        <button 
          className="btn-massive btn-outline" 
          style={{ minHeight: '100px', backgroundColor: 'transparent', borderColor: '#fff', color: '#fff' }}
          onClick={handleSnooze}
        >
          <Clock size={36} className="icon" />
          <span style={{ fontWeight: 'bold' }}>{t('remindAgain10') || 'Remind Again in 10 Minutes'}</span>
        </button>
      </div>
    </div>
  );
};
