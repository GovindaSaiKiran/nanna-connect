import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Save } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { formatPhoneNumber } from '../utils/phoneUtils';

export const AddContact = ({ navigate }) => {
  const { contacts, addContact, speak, t } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setError(t('enterNameAndNumber'));
      speak(t('enterNameAndNumber'));
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    // Check if number exists
    const existing = (Array.isArray(contacts) ? contacts : []).find(c => c.phone === formattedPhone);
    if (existing) {
      if (!window.confirm(`${existing.name} ${t('updateExisting')}`)) {
        return;
      }
    }

    addContact({ name: name.trim(), phone: formattedPhone });
    speak(t('contactSaved'));
    navigate('Home');
  };

  const handleImport = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contactsList = await navigator.contacts.select(props, opts);
        
        if (contactsList.length > 0) {
          const contact = contactsList[0];
          setName(contact.name[0] || '');
          setPhone(contact.tel[0] || '');
        }
      } catch (ex) {
        console.error('Contact picker failed', ex);
        setError(t('importFailed'));
      }
    } else {
      setError(t('notSupported'));
    }
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('addContactTitle')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <button 
          className="btn-massive btn-outline" 
          onClick={handleImport}
          style={{ marginBottom: '16px', minHeight: '80px' }}
        >
          <User className="icon" />
          <span>{t('importFromPhone')}</span>
        </button>

        <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--text-secondary)' }}>
          {t('or')}
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('nameLabel')}</label>
          <input 
            type="text" 
            className="massive-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('nameLabel')}
          />
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('numberLabel')}</label>
          <input 
            type="tel" 
            className="massive-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
          />
        </div>

        {error && <p className="text-large" style={{ color: 'var(--danger-color)' }}>{error}</p>}

        <button 
          className="btn-massive btn-success" 
          onClick={handleSave}
          style={{ marginTop: '16px' }}
        >
          <Save className="icon" />
          <span>{t('save')}</span>
        </button>
      </div>
    </div>
  );
};
