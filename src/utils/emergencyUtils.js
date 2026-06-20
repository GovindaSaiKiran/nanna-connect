export const sendEmergencyWhatsApp = async (phone, messageTemplate) => {
  // Strip non-numeric characters from phone except leading plus
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '+91' + cleanPhone.substring(1); // Assume India if starts with 0
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+91' + cleanPhone; // Default to India prefix
  }
  
  // Remove the + for wa.me link
  const waPhone = cleanPhone.replace('+', '');

  let locationLink = '';
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
    });
    const { latitude, longitude } = position.coords;
    locationLink = `\n\nLocation: https://maps.google.com/?q=${latitude},${longitude}`;
  } catch (error) {
    console.error("Location access denied or unavailable", error);
  }

  const finalMessage = messageTemplate + locationLink;
  const encodedMessage = encodeURIComponent(finalMessage);
  
  const url = `https://wa.me/${waPhone}?text=${encodedMessage}`;
  window.open(url, '_blank');
};
