import React from 'react';
import { ArrowLeft, Plus, Star, Phone, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const EmergencyContacts = ({ navigate }) => {
  const { emergencyContacts, defaultServices, removeEmergencyContact, setPrimary, setSecondary, t } = useAppContext();

  const handleRemove = (id, name) => {
    if (window.confirm(t('remove') + ' ' + name + '?')) {
      removeEmergencyContact(id);
    }
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title" style={{ color: 'var(--danger-color)' }}>{t('emergencyContacts')}</h1>
      </div>

      <button 
        className="btn-massive btn-danger" 
        style={{ minHeight: '80px', marginBottom: '24px' }}
        onClick={() => navigate('AddEmergencyContact')}
      >
        <Plus size={32} className="icon" />
        <span className="text-large">{t('addEmergencyContact')}</span>
      </button>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Default Services */}
        <div>
          {defaultServices.map(service => (
            <div key={service.id} style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '24px',
              border: '2px solid var(--danger-color)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ fontSize: '3rem' }}>{service.icon}</span>
              <div style={{ flex: 1 }}>
                <div className="text-huge" style={{ fontWeight: 'bold' }}>{t(service.id) || service.name}</div>
                <div className="text-large" style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>{service.phone}</div>
              </div>
            </div>
          ))}
        </div>

        {/* User Added Contacts */}
        {emergencyContacts.length > 0 && (
          <div>
            <h2 className="text-large" style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Your Contacts
            </h2>
            {emergencyContacts.map(contact => (
              <div key={contact.id} style={{
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '24px',
                border: '2px solid #eee',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="text-huge" style={{ fontWeight: 'bold' }}>{contact.name}</div>
                    <div className="text-large" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{contact.phone}</div>
                    {contact.relationship && (
                      <div className="text-medium" style={{ color: 'var(--text-secondary)' }}>{contact.relationship}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    {contact.isPrimary && <span style={{ backgroundColor: 'var(--warning-color)', padding: '4px 12px', borderRadius: '16px', fontWeight: 'bold', color: '#000' }}>⭐ {t('primaryContact')}</span>}
                    {contact.isSecondary && <span style={{ backgroundColor: '#e0e0e0', padding: '4px 12px', borderRadius: '16px', fontWeight: 'bold' }}>⭐ {t('secondaryContact')}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    className={`btn-massive ${contact.isPrimary ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, minHeight: '60px', padding: '8px' }}
                    onClick={() => setPrimary(contact.id)}
                  >
                    <Star size={24} className="icon" />
                    <span>Primary</span>
                  </button>
                  <button 
                    className={`btn-massive ${contact.isSecondary ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, minHeight: '60px', padding: '8px' }}
                    onClick={() => setSecondary(contact.id)}
                  >
                    <Star size={24} className="icon" />
                    <span>Secondary</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-massive btn-outline"
                    style={{ flex: 1, minHeight: '60px', padding: '8px' }}
                    onClick={() => navigate('AddEmergencyContact', contact)}
                  >
                    <Edit2 size={24} className="icon" />
                    <span>{t('edit')}</span>
                  </button>
                  <button 
                    className="btn-massive btn-outline"
                    style={{ flex: 1, minHeight: '60px', padding: '8px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                    onClick={() => handleRemove(contact.id, contact.name)}
                  >
                    <Trash2 size={24} className="icon" />
                    <span>{t('remove')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
