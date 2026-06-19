export const formatPhoneNumber = (number) => {
  if (!number) return '';
  
  // Remove all non-digit characters except +
  let cleaned = number.replace(/[^\d+]/g, '');
  
  // If it starts with 0 (often used in India for STD), remove it for WhatsApp
  if (cleaned.startsWith('0') && cleaned.length > 10) {
    cleaned = cleaned.substring(1);
  }

  // If it doesn't start with +, assume it's an Indian number and prepend +91
  if (!cleaned.startsWith('+')) {
    // If it's a 10 digit number, prepend +91
    if (cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    }
  }

  return cleaned;
};
