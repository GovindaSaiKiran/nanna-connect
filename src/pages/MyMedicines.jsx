import React from 'react';
import { ArrowLeft, Pill, Plus, Edit2, Trash2, History } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getMedicineIcon, formatMedicineTime } from '../utils/timeUtils';

export const MyMedicines = ({ navigate }) => {
  const { medicines, deleteMedicine, speak, t } = useAppContext();

  const handleDelete = (id, name) => {
    if (window.confirm(t('delete') + ' ' + name + '?')) {
      deleteMedicine(id);
    }
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('myMedicines')}</h1>
      </div>

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-huge" style={{ fontWeight: 'bold' }}>
                  {getMedicineIcon(med.type)} {med.name}
                </span>
                <span className="text-huge" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  {formatMedicineTime(med.type, med.time, t)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
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
