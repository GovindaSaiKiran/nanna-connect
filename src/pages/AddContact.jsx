import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, Save } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { formatPhoneNumber } from '../utils/phoneUtils';
import { RELATIONSHIPS, getRelationshipLabel } from '../utils/relationshipDictionary';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const AddContact = ({ navigate, editData }) => {
  const { contacts, addContact, updateContact, speak, t, language } = useAppContext();
  const [name, setName] = useState('');
  const [localName, setLocalName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [error, setError] = useState('');
  
  const [duplicateRelWarning, setDuplicateRelWarning] = useState(null);

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setLocalName(editData.localName || '');
      setPhone(editData.phone || '');
      setRelationship(editData.relationship || '');
    }
  }, [editData]);

  const commitSave = (finalRelationship) => {
    const formattedPhone = formatPhoneNumber(phone);
    const contactData = { name: name.trim(), localName: localName.trim(), phone: formattedPhone, relationship: finalRelationship };
    
    if (editData && editData.id) {
      updateContact(editData.id, contactData);
      speak(t('contactSaved'));
      navigate('CallContact');
    } else {
      addContact(contactData);
      speak(t('contactSaved'));
      navigate('Home');
    }
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setError(t('enterNameAndNumber'));
      speak(t('enterNameAndNumber'));
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    // Check if number exists and we aren't editing that same contact
    if (!editData || editData.phone !== formattedPhone) {
      const existing = (Array.isArray(contacts) ? contacts : []).find(c => c.phone === formattedPhone);
      if (existing) {
        if (!window.confirm(`${existing.name} ${t('updateExisting') || 'already exists. Update?'}`)) {
          return;
        }
      }
    }

    // Check relationship duplicates
    if (relationship) {
      const actualExistingRelContact = (Array.isArray(contacts) ? contacts : []).find(c => 
        c.relationship === relationship && (!editData || c.id !== editData.id)
      );

      if (actualExistingRelContact) {
         setDuplicateRelWarning(actualExistingRelContact);
         return;
      }
    }

    commitSave(relationship);
  };

  const handleReplaceDuplicate = () => {
     if (duplicateRelWarning && duplicateRelWarning.id) {
        updateContact(duplicateRelWarning.id, { relationship: '' });
     }
     setDuplicateRelWarning(null);
     commitSave(relationship);
  };

  const handleKeepBoth = () => {
     setDuplicateRelWarning(null);
     commitSave(relationship);
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
        <button className="back-btn" onClick={() => navigate(editData ? 'CallContact' : 'Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{editData ? t('editContactTitle') : t('addContact')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {!editData && (
            <button 
            className="btn-massive btn-outline" 
            onClick={handleImport}
            style={{ marginBottom: '16px', minHeight: '80px' }}
            >
            <User className="icon" />
            <span>{t('importFromPhone')}</span>
            </button>
        )}

        {!editData && (
            <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--text-secondary)' }}>
            {t('or')}
            </div>
        )}

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('nameLabel')} ({t('english')})</label>
          <input 
            type="text" 
            className="massive-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('nameEnglishPlaceholder')}
          />
        </div>

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>{t('localNameLabel')}</label>
          <input 
            type="text" 
            className="massive-input"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder={t('localNamePlaceholder')}
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

        <div>
          <label className="text-large" style={{ display: 'block', marginBottom: '8px' }}>Relationship (Optional)</label>
          <select 
            className="massive-input"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '2px solid #ccc', fontSize: '1.5rem', backgroundColor: '#fff' }}
          >
            <option value="">{t('relationship') || 'None'}</option>
            {RELATIONSHIPS.map(r => (
              <option key={r} value={r}>{getRelationshipLabel(r, language)}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-large" style={{ color: 'var(--danger-color)' }}>{error}</p>}

        <button 
          className="btn-massive btn-success" 
          onClick={handleSave}
          style={{ marginTop: '16px' }}
        >
          <Save className="icon" />
          <span>{editData ? t('update') : t('save')}</span>
        </button>
      </div>

      {duplicateRelWarning && (
        <ConfirmationDialog
          title="Duplicate Relationship"
          message={`${duplicateRelWarning.name} is already assigned as ${getRelationshipLabel(relationship, language)}. What would you like to do?`}
          onConfirm={handleReplaceDuplicate}
          confirmText="Replace"
          confirmVariant="warning"
          extraAction={{ label: "Keep Both", onClick: handleKeepBoth, variant: "outline" }}
          onCancel={() => setDuplicateRelWarning(null)}
          cancelText="Cancel"
        />
      )}
    </div>
  );
};
