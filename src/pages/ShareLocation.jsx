import React, { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const ShareLocation = ({ navigate }) => {
  const { contacts, speak, t } = useAppContext();
  const [step, setStep] = useState(1); // 1: Get Location, 2: Select Contact
  const [location, setLocation] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleGetLocation = () => {
    speak(t('gettingLocation'));
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`);
          setStep(2);
          speak(t('whoToSend'));
        },
        (error) => {
          console.error('Error getting location', error);
          speak(t('locationError'));
        }
      );
    } else {
      speak(t('cantShare'));
    }
  };

  const handleSend = () => {
    const message = encodeURIComponent(`My location: ${location}`);
    const phone = selectedContact.phone.replace(/[^\d+]/g, '');
    window.location.href = `https://wa.me/${phone}?text=${message}`;
    speak(t('locationSent'));
    navigate('Home');
  };

  return (
    <div className="app-container">
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title">{t('locationTitle')}</h1>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
          <button 
            className="btn-massive btn-primary"
            onClick={handleGetLocation}
            style={{ minHeight: '200px' }}
          >
            <MapPin className="icon" style={{ fontSize: '4rem' }} />
            <span className="text-huge">{t('shareLocation')}</span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="text-huge" style={{ textAlign: 'center', marginBottom: '16px' }}>
            {t('whoToSend')}
          </h2>
          
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
          title={t('locationTitle')}
          message={`${t('sendLocationConfirm')} ${selectedContact?.name}?`}
          confirmText={t('send')}
          cancelText={t('cancel')}
          onConfirm={handleSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
