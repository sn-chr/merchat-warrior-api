import { Select } from '../../common/Select';
import { phoneCodes } from '../../../utils/constants/phoneCodes';

export function PhoneInput({ countryCode, phone, onCountryChange, onPhoneChange, required }) {
  const renderPhoneOption = (option) => (
    <>
      <img 
        src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
        alt={`${option.name} flag`}
        className="w-6 h-4 object-cover rounded-sm shadow-sm"
      />
      <span className="text-gray-900 font-medium">+{option.phoneCode}</span>
      <span className="flex-1 text-gray-500">{option.name}</span>
    </>
  );

  const renderSelectedPhone = (option) => option && (
    <div className="flex items-center gap-3">
      <img 
        src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
        alt={`${option.name} flag`}
        className="w-6 h-4 object-cover rounded-sm shadow-sm"
      />
      <span className="text-gray-900 font-medium">+{option.phoneCode}</span>
    </div>
  );

  return (
    <div className="flex gap-3">
      <div className="w-44">
        <Select
          value={countryCode}
          onChange={onCountryChange}
          options={phoneCodes}
          placeholder="Code"
          searchPlaceholder="Search country code..."
          renderOption={renderPhoneOption}
          renderSelected={renderSelectedPhone}
          filterOption={(option, search) => 
            option.name.toLowerCase().includes(search.toLowerCase()) ||
            option.phoneCode.includes(search)
          }
        />
      </div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        required={required}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Phone number"
      />
    </div>
  );
} 