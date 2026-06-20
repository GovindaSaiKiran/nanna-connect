import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Send, Edit2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const VoiceMessage = ({ navigate }) => {
  const { contacts, speak } = useAppContext();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  
  const [step, setStep] = useState(1); // 1: Record Message, 2: Select Contact, 3: Confirm
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (transcript && !isListening) {
      if (step === 1) {
        setMessage(transcript);
        setStep(2);
        speak('ఎవరికి పంపాలి? (Select Contact)');
      } else if (step === 2) {
        // Voice contact selection could be added here
      }
    }
  }, [transcript, isListening, step, speak]);

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message);
    const phone = selectedContact.phone.replace(/[^\d+]/g, '');
    window.location.href = `https://wa.me/${phone}?text=${encodedMessage}`;
    navigate('Home');
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">మెసేజ్ పంపండి (Message)</h1>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
          <h2 className="text-huge" style={{ textAlign: 'center' }}>మెసేజ్ చెప్పండి</h2>
          <button 
            className={`btn-massive ${isListening ? 'btn-danger' : 'btn-primary'}`}
            onClick={isListening ? stopListening : startListening}
            style={{ minHeight: '200px' }}
          >
            <Mic className="icon" style={{ fontSize: '4rem' }} />
            <span className="text-huge">{isListening ? 'వినబడుతోంది...' : 'మాట్లాడండి'}</span>
          </button>
          
          {transcript && <p className="text-large" style={{ textAlign: 'center' }}>{transcript}</p>}
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '2px solid var(--primary-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="text-large" style={{ color: 'var(--text-secondary)' }}>మీ మెసేజ్:</span>
              <button 
                className="btn-outline" 
                style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '8px' }}
                onClick={() => { setStep(1); setTranscript(''); }}
              >
                <Edit2 size={20} /> మార్చండి
              </button>
            </div>
            <p className="text-large">{message}</p>
          </div>

          <h2 className="text-huge" style={{ margin: '16px 0' }}>ఎవరికి పంపాలి?</h2>
          
          {(Array.isArray(contacts) ? contacts : []).map(contact => (
            <button 
              key={contact.id}
              className="btn-massive btn-outline"
              onClick={() => {
                setSelectedContact(contact);
                setShowConfirm(true);
              }}
              style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '16px 24px' }}
            >
              <span className="text-large">{contact.name}</span>
            </button>
          ))}
        </div>
      )}

      {showConfirm && (
        <ConfirmationDialog
          title="మెసేజ్ పంపాలా?"
          message={`${selectedContact?.name} కి మెసేజ్: "${message}"`}
          confirmText="పంపించు (Send)"
          cancelText="ఆపు (Cancel)"
          onListen={() => speak(message)}
          onConfirm={handleSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
