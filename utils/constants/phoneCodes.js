import { countries } from './countries';

// Common phone codes to show at the top
const topPhoneCodes = [
  { code: 'AU', phoneCode: '61', name: 'Australia' },
  { code: 'US', phoneCode: '1', name: 'United States' },
  { code: 'GB', phoneCode: '44', name: 'United Kingdom' },
  { code: 'NZ', phoneCode: '64', name: 'New Zealand' }
];

// Function to get phone code for a country
function getPhoneCode(countryCode) {
  const codes = {
    'AF': '93', 'AL': '355', 'DZ': '213', 'AS': '1-684', 'AD': '376',
    // ... (rest of the phone codes)
  };
  return codes[countryCode] || '';
}

export const phoneCodes = [
  ...topPhoneCodes,
  { code: '', phoneCode: '', name: '──────────', disabled: true },
  ...countries
    .filter(country => !topPhoneCodes.find(top => top.code === country.code))
    .map(country => ({
      code: country.code,
      name: country.name,
      phoneCode: getPhoneCode(country.code)
    })),
  { code: 'AF', name: 'Afghanistan', phoneCode: '93' },
  { code: 'AL', name: 'Albania', phoneCode: '355' },
  { code: 'DZ', name: 'Algeria', phoneCode: '213' },
  { code: 'AS', name: 'American Samoa', phoneCode: '1684' },
  { code: 'AD', name: 'Andorra', phoneCode: '376' },
  { code: 'AO', name: 'Angola', phoneCode: '244' },
  { code: 'AI', name: 'Anguilla', phoneCode: '1264' },
  { code: 'AG', name: 'Antigua and Barbuda', phoneCode: '1268' },
  { code: 'AR', name: 'Argentina', phoneCode: '54' },
  { code: 'AM', name: 'Armenia', phoneCode: '374' },
  { code: 'AW', name: 'Aruba', phoneCode: '297' },
  { code: 'AT', name: 'Austria', phoneCode: '43' },
  { code: 'AZ', name: 'Azerbaijan', phoneCode: '994' },
  // ... Add all country codes
]; 