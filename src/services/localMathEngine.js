import { FEATURES } from '../config/featureFlags';

const mathDictionary = {
  numbers: {
    'సున్నా': 0, 'शून्य': 0, 'பூஜ்ஜியம்': 0, 'ಸೊನ್ನೆ': 0, 'പൂജ്യം': 0, 'zero': 0,
    'ఒకటి': 1, 'एक': 1, 'ஒன்று': 1, 'ಒಂದು': 1, 'ഒന്ന്': 1, 'one': 1,
    'రెండు': 2, 'दो': 2, 'இரண்டு': 2, 'ಎರಡು': 2, 'രണ്ട്': 2, 'two': 2,
    'మూడు': 3, 'तीन': 3, 'மூன்று': 3, 'ಮೂರು': 3, 'മൂന്ന്': 3, 'three': 3,
    'నాలుగు': 4, 'चार': 4, 'நான்கு': 4, 'ನಾಲ್ಕು': 4, 'നാല്': 4, 'four': 4,
    'ఐదు': 5, 'पाँच': 5, 'ஐந்து': 5, 'ಐದು': 5, 'അഞ്ച്': 5, 'five': 5,
    'ఆరు': 6, 'छह': 6, 'ஆறு': 6, 'ಆರು': 6, 'ആറ്': 6, 'six': 6,
    'ఏడు': 7, 'सात': 7, 'ஏழு': 7, 'ಏಳು': 7, 'ഏഴ്': 7, 'seven': 7,
    'ఎనిమిది': 8, 'आठ': 8, 'எட்டு': 8, 'ಎಂಟು': 8, 'എട്ട്': 8, 'eight': 8,
    'తొమ్మిది': 9, 'नौ': 9, 'ஒன்பது': 9, 'ಒಂಬತ್ತು': 9, 'ഒമ്പത്': 9, 'nine': 9,
    'పది': 10, 'दस': 10, 'பத்து': 10, 'ಹತ್ತು': 10, 'പത്ത്': 10, 'ten': 10
  },
  operators: {
    'ప్లస్': '+', 'प्लस': '+', 'பிளஸ்': '+', 'ಪ್ಲಸ್': '+', 'പ്ലസ്': '+', 'plus': '+',
    'మైనస్': '-', 'माइनस': '-', 'மைனஸ்': '-', 'ಮೈನಸ್': '-', 'മൈനസ്': '-', 'minus': '-',
    'ఇంటు': '*', 'इंटू': '*', 'இண்டு': '*', 'ಇಂಟು': '*', 'ഇന്റു': '*', 'into': '*', 'times': '*', 'multiplied by': '*',
    'బై': '/', 'बाय': '/', 'பை': '/', 'ಬೈ': '/', 'ബൈ': '/', 'divided by': '/'
  }
};

export const localMathEngine = {
  detectMath: (transcript) => {
    if (!FEATURES.LOCAL_MATH_ENGINE) return null;
    if (!transcript) return null;

    let text = transcript.toLowerCase();

    const hasOperator = Object.keys(mathDictionary.operators).some(op => text.includes(op));
    if (!hasOperator && !text.match(/[\+\-\*\/]/)) return null;

    Object.keys(mathDictionary.numbers).forEach(word => {
      text = text.replace(new RegExp(word, 'g'), mathDictionary.numbers[word]);
    });
    
    Object.keys(mathDictionary.operators).forEach(word => {
      text = text.replace(new RegExp(word, 'g'), mathDictionary.operators[word]);
    });

    const mathMatch = text.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
    
    if (mathMatch) {
      try {
        const expression = mathMatch[0];
        const result = new Function('return ' + expression)();
        return {
          action: 'answer_math',
          expression: expression,
          result: result,
          confidence: 0.95
        };
      } catch (e) {
        return null;
      }
    }

    return null;
  }
};
