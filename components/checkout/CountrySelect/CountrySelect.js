import { Select } from '../../common/Select';
import { sortedCountries } from '../../../utils/constants/countries';

export function CountrySelect({ value, onChange, required }) {
  const renderCountryOption = (option) => (
    <>
      <img 
        src={option.flag} 
        alt={`${option.name} flag`}
        className="w-6 h-4 object-cover rounded-sm shadow-sm"
      />
      <span className="flex-1 text-gray-900">{option.name}</span>
      <span className="text-gray-400 text-sm">{option.code}</span>
    </>
  );

  const renderSelectedCountry = (option) => option && (
    <div className="flex items-center gap-3">
      <img 
        src={option.flag} 
        alt={`${option.name} flag`}
        className="w-6 h-4 object-cover rounded-sm shadow-sm"
      />
      <span className="text-gray-900">{option.name}</span>
    </div>
  );

  return (
    <Select
      value={value}
      onChange={(code) => onChange({ target: { name: 'customerCountry', value: code }})}
      options={sortedCountries.map(country => ({
        ...country,
        value: country.code // Add value property for Select component
      }))}
      placeholder="Select a country"
      searchPlaceholder="Search countries..."
      renderOption={renderCountryOption}
      renderSelected={renderSelectedCountry}
      filterOption={(option, search) => 
        !option.disabled && (
          option.name.toLowerCase().includes(search.toLowerCase()) ||
          option.code.toLowerCase().includes(search.toLowerCase())
        )
      }
    />
  );
} 