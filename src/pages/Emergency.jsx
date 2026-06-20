import React, { useState } from 'react';
import { ArrowLeft, AlertOctagon, Phone } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const Emergency = ({ navigate }) => {
  const { speak } = useAppContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const emergencyContacts = [
    { name: 'Govinda Sai Kiran (Primary)', phone: '+919999999999' }, // This should be updated by the user in reality
    { name: 'Amma (Secondary)', phone: '+918888888888' }
  ];

  const handleEmergency = (contact) => {
    speak(`${contact.name} కి కాల్ చేస్తున్నాము`);
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#fff5f5' }}>
      <div className="screen-header">
        <button className="back-btn" onClick={() => navigate('Home')}>
          <ArrowLeft size={32} />
        </button>
        <h1 className="screen-title" style={{ color: 'var(--danger-color)' }}>సహాయం (Emergency)</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
        <h2 className="text-huge" style={{ textAlign: 'center', color: 'var(--danger-color)' }}>
          ఎవరికి కాల్ చేయాలి?
        </h2>

        {(Array.isArray(emergencyContacts) ? emergencyContacts : []).map(contact => (
          <button 
            key={contact.name}
            className="btn-massive btn-danger"
            onClick={() => {
              setSelectedContact(contact);
              setShowConfirm(true);
            }}
            style={{ padding: '32px' }}
          >
            <Phone className="icon" style={{ fontSize: '3rem' }} />
            <span className="text-huge">{contact.name}</span>
          </button>
        ))}
      </div>

      {showConfirm && (
        <ConfirmationDialog
          title="ఎమర్జెన్సీ కాల్?"
          message={`నిజంగానే ${selectedContact?.name} కి కాల్ చేయాలా?`}
          confirmText="కాల్ చేయి (Call)"
          cancelText="ఆపు (Cancel)"
          onConfirm={() => handleEmergency(selectedContact)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};
