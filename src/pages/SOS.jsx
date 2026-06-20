import React, { useState } from 'react';
import { Star, Phone, ArrowLeft, XCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { sendEmergencyWhatsApp } from '../utils/emergencyUtils';

export const SOS = ({ navigate }) => {
  const { getPrimaryContact, getSecondaryContact, defaultServices, speak, t } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const primaryContact = getPrimaryContact();
  const secondaryContact = getSecondaryContact();
  const ambulance = defaultServices.find(s => s.id === 'ambulance');
  const police = defaultServices.find(s => s.id === 'police');
  const fire = defaultServices.find(s => s.id === 'fire');
  const hospital = defaultServices.find(s => s.id === 'hospital');

  const handlePrimaryEmergency = async () => {
    if (!primaryContact) return;
    
    setIsProcessing(true);
    speak(t('call') + ' ' + t('primaryContact'));

    // Step 1: Open WhatsApp in a new tab with the location and SOS message
    await sendEmergencyWhatsApp(primaryContact.phone, t('sosMessage'));

    // Step 2: Initiate phone call
    window.location.href = `tel:${primaryContact.phone}`;
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const handleSecondaryEmergency = async () => {
    if (!secondaryContact) return;
    
    setIsProcessing(true);
    speak(t('call') + ' ' + t('secondaryContact'));

    await sendEmergencyWhatsApp(secondaryContact.phone, t('sosMessage'));
    window.location.href = `tel:${secondaryContact.phone}`;
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const handleServiceEmergency = (service) => {
    if (!service) return;
    speak(t('call') + ' ' + (t(service.id) || service.name));
    window.location.href = `tel:${service.phone}`;
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#fff5f5' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center', marginTop: '24px' }}>
        <h1 className="text-huge" style={{ color: 'var(--danger-color)', fontSize: '3rem' }}>🆘 {t('sos')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
        
        {primaryContact && (
          <button 
            className="btn-massive btn-danger"
            onClick={handlePrimaryEmergency}
            disabled={isProcessing}
            style={{ minHeight: '140px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Star size={40} className="icon" />
              <span className="text-huge">{t('call')} {primaryContact.name}</span>
            </div>
            <span className="text-large" style={{ opacity: 0.9 }}>
              ⭐ {t('primaryContact')}
            </span>
          </button>
        )}

        {secondaryContact && (
          <button 
            className="btn-massive btn-outline"
            onClick={handleSecondaryEmergency}
            disabled={isProcessing}
            style={{ minHeight: '140px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#fff', borderColor: 'var(--warning-color)', color: 'var(--warning-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Star size={40} className="icon" />
              <span className="text-huge">{t('call')} {secondaryContact.name}</span>
            </div>
            <span className="text-large" style={{ opacity: 0.9 }}>
              ⭐ {t('secondaryContact')}
            </span>
          </button>
        )}

        {ambulance && (
          <button 
            className="btn-massive btn-outline"
            onClick={() => handleServiceEmergency(ambulance)}
            style={{ minHeight: '120px', padding: '24px', backgroundColor: '#fff', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '3rem' }}>🚑</span>
              <span className="text-huge">{t('call')} {t('ambulance') || ambulance.name}</span>
            </div>
          </button>
        )}

        {police && (
          <button 
            className="btn-massive btn-outline"
            onClick={() => handleServiceEmergency(police)}
            style={{ minHeight: '120px', padding: '24px', backgroundColor: '#fff', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '3rem' }}>🚓</span>
              <span className="text-huge">{t('call')} {t('police') || police.name}</span>
            </div>
          </button>
        )}

        {fire && (
          <button 
            className="btn-massive btn-outline"
            onClick={() => handleServiceEmergency(fire)}
            style={{ minHeight: '120px', padding: '24px', backgroundColor: '#fff', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '3rem' }}>🚒</span>
              <span className="text-huge">{t('call')} {t('fireService') || fire.name}</span>
            </div>
          </button>
        )}

        {hospital && (
          <button 
            className="btn-massive btn-outline"
            onClick={() => handleServiceEmergency(hospital)}
            style={{ minHeight: '120px', padding: '24px', backgroundColor: '#fff', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '3rem' }}>🏥</span>
              <span className="text-huge">{t('call')} {t('hospital') || hospital.name}</span>
            </div>
          </button>
        )}

      </div>

      <button 
        className="btn-massive btn-outline"
        onClick={() => navigate('Home')}
        style={{ marginTop: '32px', minHeight: '100px', backgroundColor: '#f5f5f5', color: 'var(--text-primary)', border: 'none' }}
      >
        <XCircle size={32} className="icon" />
        <span className="text-huge">{t('cancel')}</span>
      </button>
    </div>
  );
};
