import React from 'react';
import { Phone, Ambulance, ShieldAlert, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const EmergencyMode = ({ navigate }) => {
  const { emergencyContacts, defaultServices, t, speakFeedback } = useAppContext();

  const handleCall = (name, phone) => {
    speakFeedback(`${t('calling')} ${name}`);
    window.location.href = `tel:${phone}`;
  };

  const primary = emergencyContacts.find(c => c.isPrimary);
  const secondary = emergencyContacts.find(c => c.isSecondary);
  
  // Try to find specific roles if primary/secondary aren't set
  const son = emergencyContacts.find(c => c.relationship && c.relationship.toLowerCase().includes('son'));
  const daughter = emergencyContacts.find(c => c.relationship && c.relationship.toLowerCase().includes('daughter'));
  const doctor = emergencyContacts.find(c => c.relationship && c.relationship.toLowerCase().includes('doctor'));

  const topContacts = [];
  if (primary) topContacts.push(primary);
  if (secondary && secondary.id !== primary?.id) topContacts.push(secondary);
  
  if (topContacts.length === 0) {
    if (son) topContacts.push(son);
    if (daughter) topContacts.push(daughter);
    if (doctor) topContacts.push(doctor);
  }

  // Fallback if still empty: just take the first two
  if (topContacts.length === 0 && emergencyContacts.length > 0) {
    topContacts.push(emergencyContacts[0]);
    if (emergencyContacts.length > 1) topContacts.push(emergencyContacts[1]);
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#b71c1c', // Dark red
      color: '#fff',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <ShieldAlert size={64} style={{ display: 'block', margin: '0 auto 8px' }} />
        <h1 className="text-huge" style={{ margin: 0, fontWeight: 'bold' }}>{t('emergencyMode') || 'Emergency Mode'}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        
        {topContacts.map((contact, idx) => (
          <button 
            key={`contact-${idx}`}
            onClick={() => handleCall(contact.name, contact.phone)}
            style={{
              backgroundColor: '#fff',
              color: '#b71c1c',
              border: 'none',
              borderRadius: '24px',
              padding: '32px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              minHeight: '180px'
            }}
          >
            <Phone size={64} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1.1' }}>{t('call') || 'Call'} {contact.relationship || contact.name}</div>
              <div style={{ fontSize: '2rem', opacity: 0.8, marginTop: '8px' }}>{contact.phone}</div>
            </div>
          </button>
        ))}

        {/* Ambulance Default */}
        <button 
          onClick={() => handleCall('Ambulance', '108')}
          style={{
            backgroundColor: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            padding: '32px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            minHeight: '180px'
          }}
        >
          <Ambulance size={64} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1.1' }}>{t('ambulance') || 'Call Ambulance'}</div>
            <div style={{ fontSize: '2rem', opacity: 0.9, marginTop: '8px' }}>108</div>
          </div>
        </button>

      </div>

      <button 
        onClick={() => navigate('Home')}
        style={{
          marginTop: '32px',
          backgroundColor: 'transparent',
          border: '4px solid #fff',
          color: '#fff',
          borderRadius: '50px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}
      >
        <X size={36} />
        {t('exit') || 'Exit Emergency Mode'}
      </button>

    </div>
  );
};
