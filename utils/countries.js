import { getName, getCode, getCodes } from 'country-list';

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