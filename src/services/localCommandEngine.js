import { FEATURES } from '../config/featureFlags';

const commandDictionary = [
  // Navigation
  { action: 'navigate', target: 'Home', keywords: ['home', 'హోమ్', 'होम', 'வீடு', 'ಮನೆ', 'വീട്'] },
  { action: 'navigate', target: 'SOS', keywords: ['sos', 'ఎస్ ఓ ఎస్', 'ఎస్ఓఎస్', 'emergency', 'ఎమర్జెన్సీ', 'आपातकाल', 'அவசரம்', 'ತುರ್ತು', 'അടിയന്തരാവസ്ഥ'] },
  { action: 'navigate', target: 'MyMedicines', keywords: ['medicines', 'medicine', 'మెడిసిన్', 'మందులు', 'दवाइयां', 'மருந்துகள்', 'ಔಷಧಿಗಳು', 'മരുന്നുകൾ'] },
  { action: 'navigate', target: 'QuickNotes', keywords: ['notes', 'నోట్స్', 'नोट्स', 'குறிப்புகள்', 'ಟಿಪ್ಪಣಿಗಳು', 'കുറിപ്പുകൾ'] },
  { 
    action: 'navigate', 
    target: 'Calculator', 
    keywords: [
      'calculator', 'calculate', 'math', 
      'క్యాలిక్యులేటర్', 'కాల్కులేటర్', 'లెక్కలు', 
      'कैलकुलेटर', 'हिसाब', 
      'கால்குலேட்டர்', 'கணக்கீடு', 
      'ಕ್ಯಾಲ್ಕುಲೇಟರ್', 'ಲೆಕ್ಕ', 
      'കാൽക്കുലേറ്റർ', 'കണക്കുകൂട്ടൽ'
    ] 
  },
  { action: 'navigate', target: 'LanguageSelection', keywords: ['language', 'భాష', 'भाषा', 'மொழி', 'ಭಾಷೆ', 'ഭാഷ'] },
  { action: 'navigate', target: 'EmergencyContacts', keywords: ['contacts', 'కాంటాక్ట్స్', 'संपर्क', 'தொடர்புகள்', 'ಸಂಪರ್ಕಗಳು', 'കോൺടാക്റ്റുകൾ'] },
  // Actions
  { action: 'call_ambulance', target: null, keywords: ['ambulance', 'అంబులెన్స్', 'एंबुलेंस', 'ஆம்புலன்ஸ்', 'ಆಂಬ್ಯುಲೆನ್ಸ್', 'ആംബുലൻസ്'] },
  { action: 'call_police', target: null, keywords: ['police', 'పోలీస్', 'पुलिस', 'காவல்துறை', 'ಪೊಲೀಸ್', 'പോലീസ്'] },
  { 
    action: 'navigate', 
    target: 'ShareLocation', 
    keywords: [
      // English
      'share location', 'share my location', 'send location', 'send my location', 'where am i', 'location',
      // Telugu
      'నా లొకేషన్ పంపు', 'నా స్థానాన్ని పంపు', 'లొకేషన్ షేర్ చేయి', 'నా స్థానం పంపు', 'లోకేషన్',
      // Hindi
      'मेरी लोकेशन भेजो', 'लोकेशन शेयर करो', 'मेरी स्थिति भेजो', 'लोकेशन',
      // Tamil
      'என் இருப்பிடத்தை அனுப்பு', 'லொகேஷன் பகிர்', 'இடம்',
      // Kannada
      'ನನ್ನ ಸ್ಥಳ ಕಳುಹಿಸು', 'ಲೊಕೇಶನ್ ಹಂಚು', 'ಸ್ಥಳ',
      // Malayalam
      'എന്റെ സ്ഥലം അയയ്ക്കുക', 'ലൊക്കേഷൻ ഷെയർ ചെയ്യുക', 'ലൊക്കേഷൻ'
    ] 
  }
];

export const localCommandEngine = {
  detectCommand: (transcript) => {
    if (!FEATURES.LOCAL_COMMANDS) return null;
    if (!transcript) return null;
    const lowerTranscript = transcript.toLowerCase();

    for (const cmd of commandDictionary) {
      for (const keyword of cmd.keywords) {
        if (lowerTranscript.includes(keyword)) {
          return {
            action: cmd.action,
            target: cmd.target,
            confidence: 0.90
          };
        }
      }
    }
    return null;
  }
};
