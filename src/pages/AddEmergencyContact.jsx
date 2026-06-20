import React, { useState } from 'react';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const AddEmergencyContact = ({ navigate, editData }) => {
  const { addEmergencyContact, updateEmergencyContact, contacts, t } = useAppContext();

  const [name, setName] = useState(editData?.name || '');
  const [phone, setPhone] = useState(editData?.phone || '');
  const [relationship, setRelationship] = useState(editData?.relationship || '');
  const [showExisting, setShowExisting] = useState(false);

  const handleSave = () => {
    if (!name || !phone) return;
    
    if (editData) {
      updateEmergencyContact(editData.id, { name, phone, relationship });
    } else {
      addEmergencyContact({ name, phone, relationship });
    }
    navigate('EmergencyContacts');
  };

  const handleSelectExisting = (contact) => {
    setName(contact.name);
    setPhone(contact.phone);
    setShowExisting(false);
  };

  if (showExisting) {
    return (
      <div className="app-container">
        <div className="screen-header">
          <button className="back-btn" onClick={() => setShowExisting(false)}>
            <ArrowLeft size={32} />
          </button>
          <h1 className="screen-title">{t('selectFromExisting')}</h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {contacts.map(c => (
            <button 
              key={c.id}
              className="btn-massive btn-outline"
              style={{ minHeight: '100px', flexDirection: 'column', alignItems: 'flex-start', padding: '16px 24px' }}
              onClick={() => handleSelectExisting(c)}
            >
              <span className="text-huge" style={{ fontWeight: 'bold' }}>{c.name}</span>
              <span className="text-large" style={{ color: 'var(--text-secondary)' }}>{c.phone}</span>
            </button>
          ))}
          {contacts.length === 0 && (
            <p className="text-large" style={{ textAlign: 'center', marginTop: '32px' }}>No contacts found.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('EmergencyContacts')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{editData ? t('edit') : t('addEmergencyContact')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
        
        {!editData && (
          <button 
            className="btn-massive btn-outline"
            style={{ minHeight: '80px', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
            onClick={() => setShowExisting(true)}
          >
            <Users size={32} className="icon" />
            <span className="text-large">{t('selectFromExisting')}</span>
          </button>
        )}

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('name')}</label>
          <input 
            type="text" 
            className="massive-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Govinda"
          />
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('phone')}</label>
          <input 
            type="tel" 
            className="massive-input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 9999999999"
          />
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('relationship')}</label>
          <input 
            type="text" 
            className="massive-input"
            value={relationship}
            onChange={e => setRelationship(e.target.value)}
            placeholder="e.g. Son"
          />
        </div>

        <button 
          className="btn-massive btn-primary"
          style={{ marginTop: 'auto', minHeight: '100px' }}
          onClick={handleSave}
          disabled={!name.trim() || !phone.trim()}
        >
          <Save size={32} className="icon" />
          <span className="text-huge">{t('save')}</span>
        </button>

      </div>
    </div>
  );
};
