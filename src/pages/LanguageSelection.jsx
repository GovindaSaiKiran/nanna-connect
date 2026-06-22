import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Activity } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const LanguageSelection = ({ navigate }) => {
  const { setLanguage, speakFeedback, language, t, hasCompletedOnboarding } = useAppContext();

  const languages = [
    { code: 'en-IN', name: 'English', native: 'English', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  ];

  const handleSelect = (lang) => {
    setLanguage(lang.code);
    speakFeedback(`${lang.native} selected`);
    navigate('Home');
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#f0fdf4' }}>
      
      {hasCompletedOnboarding && (
        <div className="screen-header">
          <button className="back-btn" onClick={() => navigate('Home')}>
            <ArrowLeft size={32} />
          </button>
          <h1 className="screen-title">{t('language') || 'Settings'}</h1>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: hasCompletedOnboarding ? '0' : '32px' }}>
        <h1 className="text-huge" style={{ color: 'var(--primary-color)' }}>
          Choose Your Language
        </h1>
        <p className="text-large" style={{ color: 'var(--text-secondary)' }}>
          భాషను ఎంచుకోండి
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', paddingBottom: '32px' }}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="btn-massive btn-outline"
            onClick={() => handleSelect(lang)}
            style={{ 
              justifyContent: 'flex-start', 
              minHeight: '100px', 
              padding: '16px 24px',
              borderWidth: '3px',
              backgroundColor: language === lang.code ? '#e8f5e9' : 'transparent',
              borderColor: language === lang.code ? 'var(--success-color)' : 'var(--primary-color)'
            }}
          >
            <span style={{ fontSize: '3rem', marginRight: '24px' }}>{lang.flag}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <span className="text-huge">{lang.native}</span>
              <span className="text-large" style={{ color: 'var(--text-secondary)' }}>{lang.name}</span>
            </div>
            {language === lang.code && <CheckCircle size={32} color="var(--success-color)" />}
          </button>
        ))}

        {hasCompletedOnboarding && (
          <div style={{ marginTop: '24px', borderTop: '2px solid #ccc', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              className="btn-massive btn-primary"
              onClick={() => navigate('SystemCheck')}
            >
              <Activity size={32} className="icon" />
              <span className="text-large">{t('systemCheck') || 'System Check'}</span>
            </button>
            <button 
              className="btn-massive btn-outline"
              onClick={() => navigate('CommandHistory')}
            >
              <span style={{ fontSize: '32px', marginRight: '16px' }}>🎙️</span>
              <span className="text-large">{t('recentCommands') || 'Recent Voice Commands'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
