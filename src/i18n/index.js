import en from './en';
import te from './te';
import hi from './hi';
import ta from './ta';
import kn from './kn';
import ml from './ml';

const translations = {
  'en-IN': en,
  'te-IN': te,
  'hi-IN': hi,
  'ta-IN': ta,
  'kn-IN': kn,
  'ml-IN': ml,
  'en': en, // Fallbacks for general lang codes
  'te': te,
  'hi': hi,
  'ta': ta,
  'kn': kn,
  'ml': ml
};

export const getTranslation = (lang, key) => {
  const langObj = translations[lang] || translations['en-IN'];
  // Fallback to English if key doesn't exist in the target language
  return langObj[key] || translations['en-IN'][key] || key;
};
