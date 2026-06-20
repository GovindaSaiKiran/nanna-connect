import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Phone, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const CallContact = ({ navigate }) => {
  const { contacts, speak } = useAppContext();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (transcript) {
      setFilter(transcript);
      // Auto-search logic
      const lowerTranscript = transcript.toLowerCase();
      const matches = (Array.isArray(contacts) ? contacts : []).filter(c => 
        c.name.toLowerCase().includes(lowerTranscript) ||
        lowerTranscript.includes(c.name.toLowerCase())
      );
      
      if (matches.length === 1) {
        handleCall(matches[0]);
      } else if (matches.length > 1) {
        speak(`${matches.length} కాంటాక్ట్స్ దొరికాయి. ఒకరిని ఎంచుకోండి.`);
      } else {
        speak('కాంటాక్ట్ దొరకలేదు. మళ్ళీ చెప్పండి.');
      }
    }
  }, [transcript]);

  const handleCall = (contact) => {
    speak(`${contact.name} కి కాల్ చేస్తున్నాము`);
    window.location.href = `tel:${contact.phone}`;
  };

  const filteredContacts = (Array.isArray(contacts) ? contacts : []).filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">కాల్ చేయండి (Call)</h1>
      </div>

      <button 
        className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
        onClick={isListening ? stopListening : startListening}
        style={{ marginBottom: '24px' }}
      >
        <Mic className="icon" />
        <span>{isListening ? 'వినబడుతోంది...' : 'పేరు చెప్పండి (Speak Name)'}</span>
      </button>

      {filter && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
          <span className="text-large">Search: {filter}</span>
          <button onClick={() => setFilter('')} style={{ padding: '8px', background: 'none', border: 'none' }}>
            <X size={24} color="var(--danger-color)" />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(Array.isArray(filteredContacts) ? filteredContacts : []).map(contact => (
          <button 
            key={contact.id}
            className="btn-massive btn-outline"
            onClick={() => handleCall(contact)}
            style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '16px 24px' }}
          >
            <div style={{ backgroundColor: '#e9ecef', borderRadius: '50%', padding: '16px', marginRight: '16px' }}>
              <Phone size={32} color="var(--primary-color)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="text-large">{contact.name}</span>
              <span className="text-medium" style={{ color: 'var(--text-secondary)' }}>{contact.phone}</span>
            </div>
          </button>
        ))}
        {filteredContacts.length === 0 && (
          <p className="text-large" style={{ textAlign: 'center', marginTop: '32px' }}>
            కాంటాక్ట్స్ లేవు (No contacts found)
          </p>
        )}
      </div>
    </div>
  );
};
