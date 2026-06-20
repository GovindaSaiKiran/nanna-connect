export const getMedicineIcon = (type) => {
  if (type === 'morning') return '🌅 ';
  if (type === 'afternoon') return '☀️ ';
  if (type === 'night') return '🌙 ';
  if (type === 'day') return '☀️ '; // fallback for old data
  return '💊 ';
};

export const formatMedicineTime = (type, internalTime, t) => {
  if (!internalTime) return '';
  
  // Parse internal time (e.g. "06:00 AM" or "09:00 PM")
  const match = internalTime.match(/^(\d{2}):\d{2}\s+(AM|PM)$/);
  if (!match) return internalTime; // fallback if format changes
  
  let hour12 = parseInt(match[1], 10);
  
  // Format period using translation keys
  let periodKey = '';
  if (type === 'morning') periodKey = 'morning';
  else if (type === 'afternoon') periodKey = 'afternoon';
  else if (type === 'night') periodKey = 'night';
  else if (type === 'day') periodKey = 'morning'; // fallback
  
  const periodText = t(periodKey);
  const isSingular = hour12 === 1;
  const timeFormatTemplate = isSingular ? t('timeFormat_single') : t('timeFormat_plural');
  
  // Some languages might not have distinct plural rules or use same template
  const template = timeFormatTemplate || '{period} {hour} O\'Clock';
  
  return template.replace('{period}', periodText).replace('{hour}', hour12.toString());
};
