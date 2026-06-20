import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, RefreshCw } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const ShareLocation = ({ navigate }) => {
  const { contacts, speak } = useAppContext();
  const [status, setStatus] = useState('లొకేషన్ వెతుకుతున్నాము... (Finding location...)');
  const [locationLink, setLocationLink] = useState(null);
  const [step, setStep] = useState(1); // 1: Get Location, 2: Select Contact

  const getLocation = () => {
    setStatus('లొకేషన్ వెతుకుతున్నాము... (Finding location...)');
    if (!navigator.geolocation) {
      setStatus('మీ ఫోన్ లో లొకేషన్ సపోర్ట్ లేదు (Location not supported)');
      speak('మీ ఫోన్ లో లొకేషన్ సపోర్ట్ లేదు');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocationLink(link);
        setStatus('లొకేషన్ దొరికింది (Location found)');
        speak('లొకేషన్ దొరికింది. ఎవరికి పంపాలి?');
        setStep(2);
      },
      (error) => {
        setStatus('లొకేషన్ దొరకలేదు. దయచేసి పర్మిషన్ ఇవ్వండి. (Location access denied)');
        speak('లొకేషన్ దొరకలేదు');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleShare = (contact) => {
    const encodedMessage = encodeURIComponent(`నా లొకేషన్: ${locationLink}`);
    const phone = contact.phone.replace(/[^\d+]/g, '');
    window.location.href = `https://wa.me/${phone}?text=${encodedMessage}`;
    navigate('Home');
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">లొకేషన్ పంపండి (Location)</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px', padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '2px solid var(--primary-color)' }}>
        <MapPin size={64} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
        <p className="text-large">{status}</p>
        
        {step === 1 && status.includes('దొరకలేదు') && (
          <button 
            className="btn-massive btn-primary" 
            style={{ marginTop: '16px' }}
            onClick={getLocation}
          >
            <RefreshCw className="icon" />
            మళ్ళీ ప్రయత్నించండి (Retry)
          </button>
        )}
      </div>

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="text-huge">ఎవరికి పంపాలి?</h2>
          
          {(Array.isArray(contacts) ? contacts : []).map(contact => (
            <button 
              key={contact.id}
              className="btn-massive btn-outline"
              onClick={() => handleShare(contact)}
              style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '16px 24px' }}
            >
              <span className="text-large">{contact.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
