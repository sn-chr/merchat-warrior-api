import { phoneCodes } from './constants/phoneCodes';

// Validate phone number format
export function validatePhone(phone, countryCode) {
  if (!phone) return false;

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');

  // Generic international phone number pattern
  // Allows for:
  // - Optional + prefix
  // - Country code (1-3 digits)
  // - Area code and number (6-12 digits)
  const genericPattern = /^\+?[1-9]\d{6,14}$/;

  return genericPattern.test(cleanPhone);
}

// Format phone number
export function formatPhone(phone, countryCode) {
  if (!phone) return '';

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');

  // Special formatting for specific countries
  switch (countryCode) {
    case 'US':
      if (cleanPhone.length <= 10) return cleanPhone;
      const last10 = cleanPhone.slice(-10);
      return `(${last10.slice(0, 3)}) ${last10.slice(3, 6)}-${last10.slice(6)}`;
    
    case 'AU':
      if (cleanPhone.length <= 9) return cleanPhone;
      const last9 = cleanPhone.slice(-9);
      return `${last9.slice(0, 4)} ${last9.slice(4, 7)} ${last9.slice(7)}`;
    
    default:
      // Generic international format: groups of 3-4 digits
      return cleanPhone.replace(/(\d{3,4})(?=\d)/g, '$1 ').trim();
  }
}

// Format phone number for API submission
export function formatPhoneForAPI(phone, countryCode) {
  if (!phone) return '';

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Get country phone code from the country code
  const phoneCode = getPhoneCodeFromCountry(countryCode);

  // Format as +{countryCode}{number}
  // Example: +61412345678
  return `+${phoneCode}${cleanPhone}`;
}

// Helper function to get phone code from country code
function getPhoneCodeFromCountry(countryCode) {
  const codes = {
    'AU': '61',
    'US': '1',
    'GB': '44',
    'NZ': '64',
    'CA': '1',
    // Add more country codes as needed
    'AF': '93',
    'AL': '355',
    'DZ': '213',
    'AS': '1684',
    'AD': '376',
    'AO': '244',
    'AI': '1264',
    'AG': '1268',
    'AR': '54',
    'AM': '374',
    'AW': '297',
    'AT': '43',
    'AZ': '994'
  };
  return codes[countryCode] || '';
}

// Get error message
export function getPhoneError(phone, countryCode) {
  if (!phone) return 'Phone number is required';
  if (!validatePhone(phone, countryCode)) {
    return 'Please enter a valid phone number';
  }
  return '';
}

// Export all functions
export default {
  validatePhone,
  formatPhone,
  formatPhoneForAPI,
  getPhoneError
}; 