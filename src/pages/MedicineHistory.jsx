import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getMedicineIcon, formatMedicineTime } from '../utils/timeUtils';

export const MedicineHistory = ({ navigate }) => {
  const { history, t } = useAppContext();

  // Group history by date
  const groupedHistory = history.reduce((acc, item) => {
    const date = new Date(item.takenAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('MyMedicines')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('medicineHistory')}</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {Object.keys(groupedHistory).length === 0 ? (
          <p className="text-large" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No history yet.
          </p>
        ) : (
          Object.keys(groupedHistory).map(date => (
            <div key={date}>
              <h2 className="text-large" style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
                {date === new Date().toLocaleDateString() ? t('takenToday') || 'Today' : date}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {groupedHistory[date].map(item => (
                  <div 
                    key={item.id}
                    style={{
                      backgroundColor: '#fff',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div className="text-large" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {getMedicineIcon(item.type)}{item.name}
                      </div>
                      <div className="text-medium" style={{ color: 'var(--text-secondary)' }}>
                        Scheduled: {formatMedicineTime(item.type, item.scheduledTime, t)}
                      </div>
                    </div>
                    <div className="text-large" style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={24} />
                      {new Date(item.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
