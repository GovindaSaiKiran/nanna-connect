import React, { useEffect } from 'react';
import { Phone, Mic, Camera, MapPin, AlertOctagon, UserPlus, Calculator, Edit3, Pin, Globe, Pill, Volume2, VolumeX, Bot } from 'lucide-react';
import { CardButton } from '../components/CardButton';
import { useAppContext } from '../contexts/AppContext';
import { getMedicineIcon, formatMedicineTime } from '../utils/timeUtils';
import { FEATURES } from '../config/featureFlags';

export const Home = ({ navigate }) => {
  const { notes, medicines, speak, speakFeedback, voiceGuidance, setVoiceGuidance, t } = useAppContext();
  const pinnedNotes = (Array.isArray(notes) ? notes : []).filter(n => n.pinned).slice(0, 3);
  
  // Get upcoming medicines for today
  const todayString = new Date().toDateString();
  const upcomingMedicines = (Array.isArray(medicines) ? medicines : []).filter(m => m.lastTakenDate !== todayString);

  const handleNavigate = (page, announcement) => {
    navigate(page);
  };

  return (
    <div className="app-container">
      <div style={{ marginBottom: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <h1 className="text-huge" style={{ color: 'var(--primary-color)', margin: 0 }}>{t('appTitle')}</h1>
        <button 
          onClick={() => {
            const newState = !voiceGuidance;
            setVoiceGuidance(newState);
            if (newState) speak('Voice Guidance ON');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '50px',
            backgroundColor: voiceGuidance ? 'var(--success-color)' : '#eee',
            color: voiceGuidance ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {voiceGuidance ? <Volume2 size={24} /> : <VolumeX size={24} />}
          {voiceGuidance ? 'Voice Guidance ON' : 'Voice Guidance OFF'}
        </button>
      </div>

      {/* Today's Medicines Widget */}
      <div style={{ 
        backgroundColor: 'var(--card-background)', 
        padding: '16px', 
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '24px',
        border: '2px solid var(--primary-color)'
      }}>
        <h2 className="text-large" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: 'var(--primary-color)' }}>
          <Pill size={32} /> {t('todaysMedicines')}
        </h2>
        {upcomingMedicines.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcomingMedicines.map(med => (
              <div 
                key={med.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="text-large" style={{ fontWeight: 'bold' }}>
                    {getMedicineIcon(med.type)} {med.name}
                  </span>
                </div>
                <span className="text-large" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  {formatMedicineTime(med.type, med.time, t)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-medium" style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: '16px 0' }}>
            {t('noMedicinesAdded')}
          </p>
        )}
      </div>

      <div className="grid-2col" style={{ marginBottom: '24px' }}>
        {FEATURES.AI_ASSISTANT && (
          <button 
            className="btn-massive btn-primary"
            onClick={() => handleNavigate('NannaAI', '')}
            style={{ minHeight: '120px', gridColumn: 'span 2', display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center', marginBottom: '8px' }}
          >
            <Bot size={64} className="icon" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="text-huge">🤖 Nanna AI Assistant</span>
              <span className="text-large" style={{ opacity: 0.8 }}>Tap and Speak</span>
            </div>
          </button>
        )}
        <CardButton 
          icon={Pill} 
          title={t('medicineReminder')} 
          subtitle={t('medicineReminderSubtitle')}
          onClick={() => handleNavigate('MyMedicines', t('medicineReminder'))} 
        />
        <CardButton 
          icon={Phone} 
          title={t('callContact')} 
          subtitle={t('callContactSubtitle')}
          onClick={() => handleNavigate('CallContact', t('callContactVoice'))} 
        />
        <CardButton 
          icon={Mic} 
          title={t('voiceMessage')} 
          subtitle={t('voiceMessageSubtitle')}
          onClick={() => handleNavigate('VoiceMessage', t('voiceMessageVoice'))} 
        />
        <CardButton 
          icon={Camera} 
          title={t('sendPhoto')} 
          subtitle={t('sendPhotoSubtitle')}
          onClick={() => handleNavigate('SendPhoto', t('sendPhotoVoice'))} 
        />
        <CardButton 
          icon={MapPin} 
          title={t('shareLocation')} 
          subtitle={t('shareLocationSubtitle')}
          onClick={() => handleNavigate('ShareLocation', t('shareLocationVoice'))} 
        />
        <CardButton 
          icon={AlertOctagon} 
          title={t('sos')} 
          subtitle=""
          variant="danger"
          onClick={() => handleNavigate('SOS', t('sos'))} 
        />
        <CardButton 
          icon={UserPlus} 
          title={t('emergencyContacts')} 
          subtitle=""
          onClick={() => handleNavigate('EmergencyContacts', t('emergencyContacts'))} 
        />
        <CardButton 
          icon={UserPlus} 
          title={t('addContact')} 
          subtitle={t('addContactSubtitle')}
          onClick={() => handleNavigate('AddContact', t('addContactVoice'))} 
        />
        <CardButton 
          icon={Calculator} 
          title={t('calculator')} 
          subtitle={t('calculatorSubtitle')}
          onClick={() => handleNavigate('Calculator', t('calculatorVoice'))} 
        />
        <CardButton 
          icon={Edit3} 
          title={t('quickNotes')} 
          subtitle={t('quickNotesSubtitle')}
          onClick={() => handleNavigate('QuickNotes', t('quickNotesVoice'))} 
        />
        <CardButton 
          icon={Globe} 
          title={t('language')} 
          subtitle={t('languageSubtitle')}
          onClick={() => navigate('LanguageSelection')} 
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div style={{ 
          backgroundColor: 'var(--card-background)', 
          padding: '16px', 
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 className="text-large" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary-color)' }}>
            <Pin /> {t('pinnedNotes')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pinnedNotes.map(note => (
              <button 
                key={note.id}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 'var(--border-radius-md)',
                  border: '2px solid #eee',
                  backgroundColor: '#f8f9fa',
                  textAlign: 'left',
                  fontSize: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => speak(note.text)}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {note.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
