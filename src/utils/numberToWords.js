const dict = {
  en: {
    ones: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
    tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
    hundred: 'hundred',
    thousand: 'thousand',
    lakh: 'lakh'
  },
  te: {
    ones: ['సున్నా', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది', 'పది', 'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పద్నాలుగు', 'పదిహేను', 'పదహారు', 'పదిహేడు', 'పద్దెనిమిది', 'పంతొమ్మిది'],
    tens: ['', '', 'ఇరవై', 'ముప్పై', 'నలభై', 'యాభై', 'అరవై', 'డెబ్భై', 'ఎనభై', 'తొంభై'],
    hundred: 'వందల',
    hundred_single: 'వంద',
    thousand: 'వేల',
    thousand_single: 'వెయ్యి',
    lakh: 'లక్షల',
    lakh_single: 'లక్ష'
  },
  hi: {
    ones: ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'],
    tens: ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'],
    hundred: 'सौ',
    thousand: 'हज़ार',
    lakh: 'लाख'
  },
  ta: {
    ones: ['பூஜ்ஜியம்', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது', 'பத்து', 'பதினொன்று', 'பன்னிரண்டு', 'பதின்மூன்று', 'பதினான்கு', 'பதினைந்து', 'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது'],
    tens: ['', '', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது', 'அறுபது', 'எழுபது', 'எண்பது', 'தொண்ணூறு'],
    hundred: 'நூறு',
    thousand: 'ஆயிரம்',
    lakh: 'லட்சம்'
  },
  kn: {
    ones: ['ಸೊನ್ನೆ', 'ಒಂದು', 'ಎರಡು', 'ಮೂರು', 'ನಾಲ್ಕು', 'ಐದು', 'ಆರು', 'ಏಳು', 'ಎಂಟು', 'ಒಂಬತ್ತು', 'ಹತ್ತು', 'ಹನ್ನೊಂದು', 'ಹನ್ನೆರಡು', 'ಹದಿಮೂರು', 'ಹದಿನಾಲ್ಕು', 'ಹದಿನೈದು', 'ಹದಿನಾರು', 'ಹದಿನೇಳು', 'ಹದಿನೆಂಟು', 'ಹತ್ತೊಂಬತ್ತು'],
    tens: ['', '', 'ಇಪ್ಪತ್ತು', 'ಮೂವತ್ತು', 'ನಲವತ್ತು', 'ಐವತ್ತು', 'ಅರವತ್ತು', 'ಎಪ್ಪತ್ತು', 'ಎಂಬತ್ತು', 'ತೊಂಬತ್ತು'],
    hundred: 'ನೂರು',
    thousand: 'ಸಾವಿರ',
    lakh: 'ಲಕ್ಷ'
  },
  ml: {
    ones: ['പൂജ്യം', 'ഒന്ന്', 'രണ്ട്', 'മൂന്ന്', 'നാല്', 'അഞ്ച്', 'ആറ്', 'ഏഴ്', 'എട്ട്', 'ഒമ്പത്', 'പത്ത്', 'പതിനൊന്ന്', 'പന്ത്രണ്ട്', 'പതിമൂന്ന്', 'പതിനാല്', 'പതിനഞ്ച്', 'പതിനാറ്', 'പതിനേഴ്', 'പതിനെട്ട്', 'പത്തൊമ്പത്'],
    tens: ['', '', 'ഇരുപത്', 'മുപ്പത്', 'നാൽപത്', 'അമ്പത്', 'അറുപത്', 'എഴുപത്', 'എൺപത്', 'തൊണ്ണൂറ്'],
    hundred: 'നൂറ്',
    thousand: 'ആയിരം',
    lakh: 'ലക്ഷം'
  }
};

export const numberToWords = (num, lang = 'en') => {
  if (isNaN(num) || num === null || num === '') return '';
  num = Math.floor(Number(num));
  if (num < 0) return num.toString();
  
  let l = lang.substring(0, 2).toLowerCase();
  if (!dict[l]) l = 'en';
  
  const d = dict[l];

  if (num === 0) return d.ones[0];
  if (num > 999999) return num.toString();

  const getHundreds = (n, isPrefix) => {
    let str = '';
    if (n > 99) {
      const h = Math.floor(n / 100);
      const hundredWord = (d.hundred_single && n % 100 === 0) ? d.hundred_single : d.hundred;
      str += d.ones[h] + ' ' + hundredWord + ' ';
      n = n % 100;
    }
    if (n > 0) {
      if (n < 20) {
        // Use 'ఒక' instead of 'ఒకటి' for 1 when it's a multiplier prefix
        if (l === 'te' && n === 1 && isPrefix) {
          str += 'ఒక ';
        } else {
          str += d.ones[n] + ' ';
        }
      } else {
        const t = Math.floor(n / 10);
        const o = n % 10;
        str += d.tens[t] + ' ';
        if (o > 0) str += d.ones[o] + ' ';
      }
    }
    return str.trim();
  };

  let result = '';
  
  const lakhs = Math.floor(num / 100000);
  let rem = num % 100000;
  if (lakhs > 0) {
    const lakhWord = (d.lakh_single && lakhs === 1) ? d.lakh_single : d.lakh;
    result += getHundreds(lakhs, true) + ' ' + lakhWord + ' ';
  }
  
  const thousands = Math.floor(rem / 1000);
  rem = rem % 1000;
  if (thousands > 0) {
    const thousandWord = (d.thousand_single && thousands === 1) ? d.thousand_single : d.thousand;
    result += getHundreds(thousands, true) + ' ' + thousandWord + ' ';
  }
  
  if (rem > 0) {
    result += getHundreds(rem, false);
  }

  return result.trim().replace(/\s+/g, ' ');
};
