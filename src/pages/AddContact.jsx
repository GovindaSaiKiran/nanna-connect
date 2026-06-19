import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Save } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { formatPhoneNumber } from '../utils/phoneUtils';

export const AddContact = ({ navigate }) => {
  const { contacts, addContact, speak } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setError('పేరు, నంబర్ రెండు ఎంటర్ చేయండి (Enter name and number)');
      speak('పేరు, నంబర్ రెండు ఎంటర్ చేయండి');
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    // Check if number exists
    const existing = contacts.find(c => c.phone === formattedPhone);
    if (existing) {
      if (!window.confirm(`ఈ నంబర్ తో ${existing.name} ఆల్రెడీ ఉన్నారు. అప్‌డేట్ చేయాలా?`)) {
        return;
      }
    }

    addContact({ name: name.trim(), phone: formattedPhone });
    speak('కాంటాక్ట్ సేవ్ చేయబడింది');
    navigate('Home');
  };

  const handleImport = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contacts = await navigator.contacts.select(props, opts);
        
        if (contacts.length > 0) {
          const contact = contacts[0];
          setName(contact.name[0] || '');
          setPhone(contact.tel[0] || '');
        }
      } catch (ex) {
        console.error('Contact picker failed', ex);
        setError('కాంటాక్ట్ ఇంపోర్ట్ పనిచేయలేదు (Contact import failed)');
      }
    } else {
      setError('మీ ఫోన్ లో కాంటాక్ట్ ఇంపోర్ట్ పనిచేయదు (Contact import not supported)');
    }
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">కొత్త కాంటాక్ట్ (Add Contact)</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <button 
          className="btn-massive btn-outline" 
          onClick={handleImport}
          style={{ marginBottom: '16px', minHeight: '80px' }}
        >
          <User className="icon" />
          <span>ఫోన్ కాంటాక్ట్స్ నుండి తీసుకోండి (Import)</span>
        </button>

        <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--text-secondary)' }}>
          లేదా (OR)
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>పేరు (Name)</label>
          <input 
            type="text" 
            className="massive-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="పేరు"
          />
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>నంబర్ (Number)</label>
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
          <span>సేవ్ చేయండి (Save)</span>
        </button>
      </div>
    </div>
  );
};
