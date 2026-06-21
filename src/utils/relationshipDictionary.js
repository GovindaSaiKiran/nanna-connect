export const relationshipTranslations = {
  en: {
    son: "Son",
    daughter: "Daughter",
    father: "Father",
    mother: "Mother",
    brother: "Brother",
    sister: "Sister",
    wife: "Wife",
    husband: "Husband",
    doctor: "Doctor",
    friend: "Friend"
  },
  te: {
    son: "కొడుకు",
    daughter: "కూతురు",
    father: "నాన్న",
    mother: "అమ్మ",
    brother: "అన్న",
    sister: "అక్క",
    wife: "భార్య",
    husband: "భర్త",
    doctor: "డాక్టర్",
    friend: "స్నేహితుడు"
  },
  hi: {
    son: "बेटा",
    daughter: "बेटी",
    father: "पिता",
    mother: "माँ",
    brother: "भाई",
    sister: "बहन",
    wife: "पत्नी",
    husband: "पति",
    doctor: "डॉक्टर",
    friend: "मित्र"
  },
  ta: {
    son: "மகன்",
    daughter: "மகள்",
    father: "அப்பா",
    mother: "அம்மா",
    brother: "அண்ணன்",
    sister: "அக்கா",
    wife: "மனைவி",
    husband: "கணவன்",
    doctor: "மருத்துவர்",
    friend: "நண்பன்"
  },
  kn: {
    son: "ಮಗ",
    daughter: "ಮಗಳು",
    father: "ತಂದೆ",
    mother: "ಅಮ್ಮ",
    brother: "ಅಣ್ಣ",
    sister: "ಅಕ್ಕ",
    wife: "ಹೆಂಡತಿ",
    husband: "ಗಂಡ",
    doctor: "ವೈದ್ಯ",
    friend: "ಸ್ನೇಹಿತ"
  },
  ml: {
    son: "മകൻ",
    daughter: "മകൾ",
    father: "അച്ഛൻ",
    mother: "അമ്മ",
    brother: "സഹോദരൻ",
    sister: "സഹോദരി",
    wife: "ഭാര്യ",
    husband: "ഭർത്താവ്",
    doctor: "ഡോക്ടർ",
    friend: "സുഹൃത്ത്"
  }
};

export const RELATIONSHIPS = [
  'son', 'daughter', 'father', 'mother', 'brother', 'sister', 'wife', 'husband', 'doctor', 'friend'
];

export const getRelationshipLabel = (rel, lang) => {
  if (!rel) return '';
  const langCode = (lang || 'en').split('-')[0].toLowerCase();
  const dict = relationshipTranslations[langCode] || relationshipTranslations['en'];
  return dict[rel.toLowerCase()] || rel;
};

// Generate a flat keyword dictionary for the voice intent engine
export const getAllRelationshipKeywords = () => {
  const dict = {};
  RELATIONSHIPS.forEach(rel => {
     dict[rel] = new Set([rel]);
     Object.values(relationshipTranslations).forEach(langDict => {
        if (langDict[rel]) dict[rel].add(langDict[rel].toLowerCase());
     });
     
     // Add common variations/colloquialisms
     if (rel === 'father') { dict[rel].add('dad'); dict[rel].add('తండ్రి'); }
     if (rel === 'mother') { dict[rel].add('mom'); dict[rel].add('తల్లి'); }
     if (rel === 'brother') { dict[rel].add('తమ్ముడు'); dict[rel].add('ತಮ್ಮ'); }
     if (rel === 'sister') { dict[rel].add('చెల్లి'); dict[rel].add('தங்கை'); dict[rel].add('ತಂಗಿ'); }
     if (rel === 'wife') { dict[rel].add('పెళ్లాం'); }
     if (rel === 'husband') { dict[rel].add('మొగుడు'); }
     if (rel === 'friend') { dict[rel].add('ఫ్రెండ్'); }
  });
  
  const finalDict = {};
  for (const rel in dict) {
     finalDict[rel] = Array.from(dict[rel]);
  }
  return finalDict;
};

export const relationshipDictionary = getAllRelationshipKeywords();
