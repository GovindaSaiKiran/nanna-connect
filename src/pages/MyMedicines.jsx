import React, { useState } from 'react';
import { ArrowLeft, Pill, Plus, Edit2, Trash2, History, Settings, Activity } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getMedicineIcon, formatMedicineTime } from '../utils/timeUtils';

export const MyMedicines = ({ navigate }) => {
  const { medicines, history, deleteMedicine, debugInfo, t } = useAppContext();
  const [testingMode, setTestingMode] = useState(false);

  const handleDelete = (id, name) => {
    if (window.confirm(t('delete') + ' ' + name + '?')) {
      deleteMedicine(id);
    }
  };

  const todayString = new Date().toDateString();
  const todayMedicines = medicines.length;
  const takenCount = medicines.filter(m => m.lastTakenDate === todayString).length;
  const missedCount = medicines.filter(m => m.lastMissedDate === todayString).length;
  const pendingCount = todayMedicines - takenCount - missedCount;

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('myMedicines')}</h1>
        <button className="back-btn" onClick={() => setTestingMode(!testingMode)} style={{ marginLeft: 'auto', backgroundColor: testingMode ? 'var(--primary-color)' : 'transparent', color: testingMode ? '#fff' : 'inherit' }}>
          <Settings size={32} />
        </button>
      </div>

      {/* Daily Health Dashboard */}
      <div style={{ backgroundColor: '#e3f2fd', padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <h2 className="text-huge" style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={36} color="var(--primary-color)" />
          {t('todaysSummary') || "Today's Summary"}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
            <p className="text-medium" style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('medicinesToday') || 'Medicines Today'}</p>
            <p className="text-huge" style={{ fontWeight: 'bold', margin: 0 }}>{todayMedicines}</p>
          </div>
          <div style={{ backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
            <p className="text-medium" style={{ color: '#2e7d32', margin: 0 }}>{t('taken')}</p>
            <p className="text-huge" style={{ fontWeight: 'bold', color: '#2e7d32', margin: 0 }}>{takenCount}</p>
          </div>
          <div style={{ backgroundColor: '#ffebee', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
            <p className="text-medium" style={{ color: '#c62828', margin: 0 }}>{t('missed') || 'Missed'}</p>
            <p className="text-huge" style={{ fontWeight: 'bold', color: '#c62828', margin: 0 }}>{missedCount}</p>
          </div>
          <div style={{ backgroundColor: '#fff3e0', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
            <p className="text-medium" style={{ color: '#ef6c00', margin: 0 }}>{t('pending') || 'Pending'}</p>
            <p className="text-huge" style={{ fontWeight: 'bold', color: '#ef6c00', margin: 0 }}>{pendingCount}</p>
          </div>
        </div>
      </div>

      {testingMode && (
        <div style={{ backgroundColor: '#333', color: '#0f0', padding: '16px', borderRadius: '16px', marginBottom: '24px', fontFamily: 'monospace' }}>
          <h3 style={{ marginTop: 0, color: '#fff' }}>🛠 Testing Mode</h3>
          <p>Current Time: {debugInfo?.currentTime}</p>
          <p>Next Reminder: {debugInfo?.nextReminder}</p>
          <p>Time Remaining: {debugInfo?.timeRemaining}</p>
          <p>Triggered: {debugInfo?.reminderTriggered ? 'YES' : 'NO'}</p>
          <p>Notification: {debugInfo?.notificationSent ? 'SENT' : 'NO'}</p>
          <p>Voice Played: {debugInfo?.voicePlayed ? 'YES' : 'NO'}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          className="btn-massive btn-primary" 
          style={{ flex: 1, minHeight: '80px', padding: '16px' }}
          onClick={() => navigate('MedicineWizard')}
        >
          <Plus size={32} className="icon" />
          <span className="text-large">{t('addMedicine')}</span>
        </button>
        <button 
          className="btn-massive btn-outline" 
          style={{ flex: 1, minHeight: '80px', padding: '16px' }}
          onClick={() => navigate('MedicineHistory')}
        >
          <History size={32} className="icon" />
          <span className="text-large">{t('medicineHistory')}</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
        {medicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
            <Pill size={64} style={{ display: 'inline-block', marginBottom: '16px', opacity: 0.5 }} />
            <p className="text-large">{t('noMedicinesAdded')}</p>
          </div>
        ) : (
          medicines.map(med => (
            <div 
              key={med.id}
              style={{
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '24px',
                border: '2px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="text-huge" style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    {med.name}
                  </span>
                  <span className="text-large" style={{ color: 'var(--text-secondary)' }}>
                    {t('dosage') || 'Dosage'}: {med.dosage || 'N/A'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-huge" style={{ color: 'var(--primary-color)', fontWeight: 'bold', display: 'block' }}>
                    {formatMedicineTime(med.time, t)}
                  </span>
                  {med.lastTakenDate === todayString && <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✓ {t('taken')}</span>}
                  {med.lastMissedDate === todayString && <span style={{ color: '#c62828', fontWeight: 'bold' }}>⚠ {t('missed') || 'Missed'}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  className="btn-massive btn-outline" 
                  style={{ flex: 1, minHeight: '80px', padding: '12px' }}
                  onClick={() => navigate('MedicineWizard', med)}
                >
                  <Edit2 size={28} className="icon" />
                  <span className="text-large">{t('edit')}</span>
                </button>
                <button 
                  className="btn-massive btn-danger" 
                  style={{ flex: 1, minHeight: '80px', padding: '12px' }}
                  onClick={() => handleDelete(med.id, med.name)}
                >
                  <Trash2 size={28} className="icon" />
                  <span className="text-large">{t('delete')}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
