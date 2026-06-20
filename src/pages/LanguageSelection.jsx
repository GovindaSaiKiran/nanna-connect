import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const LanguageSelection = ({ navigate }) => {
  const { setLanguage, speak, t } = useAppContext();

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
    speak(`${lang.native} selected`);
    navigate('Home');
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#f0fdf4' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
              borderWidth: '3px'
            }}
          >
            <span style={{ fontSize: '3rem', marginRight: '24px' }}>{lang.flag}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="text-huge">{lang.native}</span>
              <span className="text-large" style={{ color: 'var(--text-secondary)' }}>{lang.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
