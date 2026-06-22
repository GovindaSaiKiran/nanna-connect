export const classifyTime = (time24) => {
  if (!time24) return { period: 'morning', icon: '🌅' };
  const match = time24.match(/^(\d{2}):(\d{2})/);
  if (!match) return { period: 'morning', icon: '🌅' };
  const hours = parseInt(match[1], 10);

  if (hours >= 5 && hours < 12) return { period: 'morning', icon: '🌅' };
  if (hours >= 12 && hours < 17) return { period: 'afternoon', icon: '☀️' };
  if (hours >= 17 && hours < 21) return { period: 'evening', icon: '🌇' };
  return { period: 'night', icon: '🌙' };
};

// Legacy support for older codebase components
export const getTimeClassification = (time24) => classifyTime(time24).period;
export const getMedicineIcon = (type) => {
  if (type === 'morning') return '🌅';
  if (type === 'afternoon') return '☀️';
  if (type === 'evening') return '🌇';
  if (type === 'night') return '🌙';
  if (type === 'day') return '☀️'; // fallback for old data
  return '💊';
};

export const formatMedicineTime = (time24, t) => {
  if (!time24) return '';
  
  // Legacy support for "08:00 AM" format
  let hours, mins;
  const legacyMatch = time24.match(/^(\d{2}):(\d{2})\s+(AM|PM)$/);
  if (legacyMatch) {
    hours = parseInt(legacyMatch[1], 10);
    mins = legacyMatch[2];
    if (legacyMatch[3] === 'PM' && hours < 12) hours += 12;
    if (legacyMatch[3] === 'AM' && hours === 12) hours = 0;
  } else {
    const match = time24.match(/^(\d{2}):(\d{2})/);
    if (!match) return time24;
    hours = parseInt(match[1], 10);
    mins = match[2];
  }
  
  const timeInfo = classifyTime(`${hours.toString().padStart(2, '0')}:${mins}`);
  
  const periodText = t(timeInfo.period) || timeInfo.period;
  
  let hours12 = hours % 12;
  hours12 = hours12 ? hours12 : 12; // '0' should be '12'
  const formattedHours = hours12.toString().padStart(2, '0');
  
  return `${timeInfo.icon} ${periodText} - ${formattedHours}:${mins}`;
};
