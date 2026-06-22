import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, Phone, X, Edit2, Trash2, Star, Download, Upload } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

import { contactResolutionEngine } from '../services/contactResolutionEngine';

export const CallContact = ({ navigate, matchingContacts }) => {
  const { contacts, removeContact, toggleFavorite, exportContacts, importContacts, speakFeedback, t, language } = useAppContext();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition(language);
  const [filter, setFilter] = useState('');
  
  const [contactToDelete, setContactToDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (transcript) {
      setFilter(transcript);
      
      const resolved = contactResolutionEngine.resolveContact(transcript, contacts);
      const matches = resolved.map(r => r.contact);
      
      if (matches.length === 1) {
        handleCall(matches[0]);
      } else if (matches.length > 1) {
        speakFeedback(`${matches.length} ${t('foundContacts') || 'contacts found'}`);
      } else {
        speakFeedback(t('notFoundAgain'));
      }
    }
  }, [transcript, contacts]);

  const handleCall = (contact) => {
    speakFeedback(`${t('calling')} ${contact.name}`);
    window.location.href = `tel:${contact.phone}`;
  };
  
  const handleEdit = (contact) => {
    navigate('AddContact', contact);
  };
  
  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
  };
  
  const confirmDelete = () => {
    if (contactToDelete) {
       removeContact(contactToDelete.id);
       setContactToDelete(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importContacts(file).then(() => {
        alert("Contacts imported successfully!");
      }).catch(err => {
        alert("Error importing contacts: " + err.message);
      });
    }
    e.target.value = null;
  };

  // Determine what to show: if matchingContacts prop was passed, show those initially until user types/speaks.
  let displayedContacts = [];
  if (filter) {
    // If they typed/spoke, use simple filter or the voice matches
    const lowerFilter = filter.toLowerCase();
    displayedContacts = (Array.isArray(contacts) ? contacts : []).filter(c => 
      c.name.toLowerCase().includes(lowerFilter) || 
      (c.localName && c.localName.toLowerCase().includes(lowerFilter)) ||
      (c.relationship && c.relationship.toLowerCase().includes(lowerFilter))
    );
  } else if (matchingContacts && Array.isArray(matchingContacts)) {
    displayedContacts = matchingContacts;
  } else {
    displayedContacts = contacts;
  }

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('callTitle')}</h1>
      </div>

      <button 
        className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
        onClick={isListening ? stopListening : startListening}
        style={{ marginBottom: '24px' }}
      >
        <Mic className="icon" />
        <span>{isListening ? t('listening') : t('speakName')}</span>
      </button>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          className="btn-massive btn-outline"
          style={{ flex: 1, minHeight: '60px', padding: '12px' }}
          onClick={() => navigate('AddContact')}
        >
          <Phone size={24} className="icon" />
          <span className="text-large">{t('addContact') || 'Add Contact'}</span>
        </button>
        <button 
          className="btn-massive btn-outline"
          style={{ flex: 1, minHeight: '60px', padding: '12px' }}
          onClick={exportContacts}
        >
          <Download size={24} className="icon" />
          <span className="text-large">{t('exportContacts') || 'Export'}</span>
        </button>
        <button 
          className="btn-massive btn-outline"
          style={{ flex: 1, minHeight: '60px', padding: '12px' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={24} className="icon" />
          <span className="text-large">{t('importContacts') || 'Import'}</span>
        </button>
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
      </div>

      {filter && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
          <span className="text-large">{t('search')}: {filter}</span>
          <button onClick={() => setFilter('')} style={{ padding: '8px', background: 'none', border: 'none' }}>
            <X size={24} color="var(--danger-color)" />
          </button>
        </div>
      )}

      {matchingContacts && matchingContacts.length > 1 && !filter && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '16px' }}>
           <h2 className="text-large" style={{ color: '#1565c0', textAlign: 'center', margin: 0 }}>Please select which contact to call:</h2>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px' }}>
        {displayedContacts.map(contact => (
          <div key={contact.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#fff', padding: '16px', borderRadius: '24px', border: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <button 
                  className="btn-massive btn-outline"
                  onClick={() => handleCall(contact)}
                  style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', padding: '8px', border: 'none', backgroundColor: 'transparent', textAlign: 'left' }}
              >
                  <div style={{ backgroundColor: '#e9ecef', borderRadius: '50%', padding: '16px', marginRight: '16px' }}>
                  <Phone size={32} color="var(--primary-color)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                    <span className="text-large" style={{ fontWeight: 'bold' }}>{contact.name}</span>
                    {contact.localName && <span className="text-medium" style={{ color: 'var(--text-secondary)' }}>{contact.localName}</span>}
                    <span className="text-medium" style={{ color: 'var(--primary-color)' }}>{contact.phone}</span>
                    {contact.relationship && <span className="text-medium" style={{ color: 'var(--text-secondary)' }}>{contact.relationship}</span>}
                  </div>
              </button>
              
              <button 
                onClick={() => toggleFavorite(contact.id)}
                style={{ padding: '16px', background: 'none', border: 'none' }}
              >
                <Star size={40} color={contact.isFavorite ? '#ffc107' : '#e0e0e0'} fill={contact.isFavorite ? '#ffc107' : 'none'} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button 
                className="btn-massive btn-outline"
                style={{ flex: 1, minHeight: '60px', padding: '8px' }}
                onClick={() => handleEdit(contact)}
                >
                <Edit2 size={24} className="icon" />
                <span>{t('edit')}</span>
                </button>
                <button 
                className="btn-massive btn-outline"
                style={{ flex: 1, minHeight: '60px', padding: '8px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                onClick={() => handleDeleteClick(contact)}
                >
                <Trash2 size={24} className="icon" />
                <span>{t('remove')}</span>
                </button>
            </div>
          </div>
        ))}
        {displayedContacts.length === 0 && (
          <p className="text-large" style={{ textAlign: 'center', marginTop: '32px' }}>
            {t('noContactsFound')}
          </p>
        )}
      </div>

      {contactToDelete && (
        <ConfirmationDialog
           title={`Delete ${contactToDelete.name}?`}
           message="This contact can be restored for 30 days."
           onConfirm={confirmDelete}
           confirmText="Delete"
           confirmVariant="danger"
           onCancel={() => setContactToDelete(null)}
           cancelText="Cancel"
        />
      )}
    </div>
  );
};
