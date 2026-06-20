import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const SendPhoto = ({ navigate }) => {
  const { contacts, speak } = useAppContext();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [step, setStep] = useState(1); // 1: Pick Photo, 2: Select Contact
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
      speak('ఎవరికి పంపాలి? (Select Contact)');
    }
  };

  const handleSend = async () => {
    if (navigator.share && selectedFile) {
      try {
        await navigator.share({
          files: [selectedFile],
          title: 'Photo from Nanna Connect',
          text: 'Sending a photo via Nanna Connect'
        });
        speak('ఫోటో పంపబడింది');
        navigate('Home');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      speak('మీ ఫోన్ లో షేర్ చేయడం కుదరదు');
      // Fallback could be something else if needed
    }
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">ఫోటో పంపండి (Photo)</h1>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
          
          <button 
            className="btn-massive btn-primary"
            onClick={() => fileInputRef.current?.click()}
            style={{ minHeight: '200px' }}
          >
            <Camera className="icon" style={{ fontSize: '4rem' }} />
            <span className="text-huge">ఫోటో తీయండి లేదా ఎంచుకోండి</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '12px', border: '4px solid var(--primary-color)' }} 
            />
            <button 
              className="btn-outline" 
              style={{ marginTop: '16px', padding: '12px 24px', fontSize: '1.25rem', borderRadius: '8px' }}
              onClick={() => { setStep(1); setSelectedFile(null); setPreviewUrl(null); }}
            >
              వేరే ఫోటో ఎంచుకోండి (Change Photo)
            </button>
          </div>

          <h2 className="text-huge">ఎవరికి పంపాలి?</h2>
          
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
          title="ఫోటో పంపాలా?"
          message={`${selectedContact?.name} కి ఫోటో పంపించండి.`}
          confirmText="పంపించు (Send)"
          cancelText="ఆపు (Cancel)"
          onConfirm={handleSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
