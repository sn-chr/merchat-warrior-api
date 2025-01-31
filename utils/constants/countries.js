import { getName, getCode, getCodes } from 'country-list';

// Flag emoji unicode points for each country code
const FLAG_EMOJI_OFFSET = 127397;

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => char.charCodeAt(0) + FLAG_EMOJI_OFFSET);
  return String.fromCodePoint(...codePoints);
}

export const countries = getCodes().map(code => ({
  code,
  name: getName(code),
  flag: `https://flagcdn.com/w40/${code.toLowerCase()}.png`
})).sort((a, b) => a.name.localeCompare(b.name));

// Add commonly used countries at the top
const topCountries = ['AU', 'US', 'GB', 'CA', 'NZ'];

export const sortedCountries = [
  ...topCountries.map(code => countries.find(country => country.code === code)),
  { code: '', name: '──────────', flag: '', disabled: true },
  ...countries.filter(country => !topCountries.includes(country.code))
]; 