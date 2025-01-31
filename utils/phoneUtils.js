import { phoneCodes } from './constants/phoneCodes';

// Phone format patterns by country
const PHONE_FORMATS = {
  // North America & Caribbean
  'US': { pattern: '(XXX) XXX-XXXX', length: 10, validation: /^1?\d{10}$/ },
  'CA': { pattern: '(XXX) XXX-XXXX', length: 10, validation: /^1?\d{10}$/ },
  'MX': { pattern: '(XX) XXXX XXXX', length: 10, validation: /^\d{10}$/ },
  'JM': { pattern: '(XXX) XXX-XXXX', length: 10, validation: /^1?\d{10}$/ },
  'BB': { pattern: '(XXX) XXX-XXXX', length: 10, validation: /^1?\d{10}$/ },
  
  // Europe
  'GB': { pattern: 'XXXXX XXXXXX', length: 11, validation: /^(0|44)?\d{10}$/ },
  'DE': { pattern: 'XXXX XXXXXXX', length: 11, validation: /^(0|49)?\d{10,11}$/ },
  'FR': { pattern: 'XX XX XX XX XX', length: 10, validation: /^(0|33)?\d{9}$/ },
  'IT': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|39)?\d{10}$/ },
  'ES': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|34)?\d{9}$/ },
  'PT': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|351)?\d{9}$/ },
  'NL': { pattern: 'XX XXXXXXXX', length: 10, validation: /^(0|31)?\d{9}$/ },
  'BE': { pattern: 'XXX XX XX XX', length: 9, validation: /^(0|32)?\d{9}$/ },
  'CH': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|41)?\d{9}$/ },
  'AT': { pattern: 'XXXX XXXXXX', length: 10, validation: /^(0|43)?\d{10}$/ },
  'GR': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|30)?\d{10}$/ },
  'IE': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|353)?\d{9}$/ },
  'SE': { pattern: 'XX XXX XXXX', length: 9, validation: /^(0|46)?\d{9}$/ },
  'NO': { pattern: 'XXX XX XXX', length: 8, validation: /^(0|47)?\d{8}$/ },
  'DK': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|45)?\d{8}$/ },
  'FI': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|358)?\d{9}$/ },
  'PL': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|48)?\d{9}$/ },
  'RO': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|40)?\d{9}$/ },
  'HU': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|36)?\d{9}$/ },
  'CZ': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|420)?\d{9}$/ },
  'SK': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|421)?\d{9}$/ },
  'BG': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|359)?\d{9}$/ },
  
  // Asia Pacific
  'AU': { pattern: 'XXXX XXX XXX', length: 10, validation: /^(0|61)?\d{9}$/ },
  'NZ': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|64)?\d{9}$/ },
  'CN': { pattern: 'XXX XXXX XXXX', length: 11, validation: /^(0|86)?\d{11}$/ },
  'JP': { pattern: 'XX XXXX XXXX', length: 10, validation: /^(0|81)?\d{10}$/ },
  'KR': { pattern: 'XX XXXX XXXX', length: 10, validation: /^(0|82)?\d{10}$/ },
  'IN': { pattern: 'XXXXX XXXXX', length: 10, validation: /^(0|91)?\d{10}$/ },
  'ID': { pattern: 'XXX XXXX XXXX', length: 11, validation: /^(0|62)?\d{10,11}$/ },
  'MY': { pattern: 'XX XXXX XXXX', length: 10, validation: /^(0|60)?\d{9,10}$/ },
  'SG': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|65)?\d{8}$/ },
  'TH': { pattern: 'X XXXX XXXX', length: 9, validation: /^(0|66)?\d{9}$/ },
  'VN': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|84)?\d{9,10}$/ },
  'PH': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|63)?\d{10}$/ },
  'HK': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|852)?\d{8}$/ },
  'TW': { pattern: 'XXX XXX XXX', length: 9, validation: /^(0|886)?\d{9}$/ },

  // Middle East
  'AE': { pattern: 'XX XXX XXXX', length: 9, validation: /^(0|971)?\d{9}$/ },
  'SA': { pattern: 'XX XXX XXXX', length: 9, validation: /^(0|966)?\d{9}$/ },
  'IL': { pattern: 'XX XXX XXXX', length: 9, validation: /^(0|972)?\d{9}$/ },
  'TR': { pattern: 'XXX XXX XXXX', length: 10, validation: /^(0|90)?\d{10}$/ },
  'QA': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|974)?\d{8}$/ },
  'BH': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|973)?\d{8}$/ },
  'KW': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|965)?\d{8}$/ },
  'OM': { pattern: 'XXXX XXXX', length: 8, validation: /^(0|968)?\d{8}$/ },

  // Africa
  'ZA': { pattern: 'XXX XXX XXXX', length: 10 },
  'EG': { pattern: 'XX XXXX XXXX', length: 10 },
  'NG': { pattern: 'XXX XXX XXXX', length: 10 },
  
  // South America
  'BR': { pattern: 'XX XXXXX XXXX', length: 11 },
  'AR': { pattern: 'XX XXXX XXXX', length: 10 },
  'CL': { pattern: 'X XXXX XXXX', length: 9 },
  'CO': { pattern: 'XXX XXX XXXX', length: 10 },
  'PE': { pattern: 'XXX XXX XXX', length: 9 },
};

// Format phone number for display
export function formatPhone(phone, countryCode) {
  if (!phone) return '';

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');

  // Get country format or use default
  const format = PHONE_FORMATS[countryCode] || { pattern: 'XXX XXX XXXX', length: 10 };

  // If phone number is longer than expected length, return with spaces every 3-4 digits
  if (cleanPhone.length > format.length) {
    return cleanPhone.replace(/(\d{3,4})(?=\d)/g, '$1 ').trim();
  }

  // Apply country-specific format
  let formattedNumber = format.pattern;
  let digitIndex = 0;

  for (let i = 0; i < format.pattern.length && digitIndex < cleanPhone.length; i++) {
    if (format.pattern[i] === 'X') {
      formattedNumber = formattedNumber.substring(0, i) + 
                       cleanPhone[digitIndex] + 
                       formattedNumber.substring(i + 1);
      digitIndex++;
    }
  }

  // Remove any remaining X placeholders
  formattedNumber = formattedNumber.replace(/X+/g, '').trim();
  return formattedNumber;
}

// Format phone number for API submission
export function formatPhoneForAPI(phone, countryCode) {
  if (!phone) return '';

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Get country phone code
  const phoneCodeObj = phoneCodes.find(c => c.code === countryCode && !c.disabled);
  const phoneCode = phoneCodeObj ? phoneCodeObj.phoneCode : '';

  // Format as +{countryCode}{number}
  return `+${phoneCode}${cleanPhone}`;
}

// Validate phone number format
export function validatePhone(phone, countryCode) {
  if (!phone) return false;

  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');

  // Get country format or use default
  const format = PHONE_FORMATS[countryCode];
  
  if (format) {
    // Use country-specific validation
    return cleanPhone.length === format.length;
  }

  // Generic validation for countries without specific format
  return /^\+?[1-9]\d{6,14}$/.test(cleanPhone);
}

// Get error message
export function getPhoneError(phone, countryCode) {
  if (!phone) return 'Phone number is required';
  
  if (!validatePhone(phone, countryCode)) {
    const format = PHONE_FORMATS[countryCode];
    if (format) {
      return `Please enter a valid ${format.length}-digit phone number`;
    }
    return 'Please enter a valid phone number';
  }

  return '';
}

export default {
  validatePhone,
  formatPhone,
  formatPhoneForAPI,
  getPhoneError
}; 