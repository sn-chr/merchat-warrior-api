export function PhoneInput({ countryCode, phone, onCountryChange, onPhoneChange, required }) {
  // ... other code ...

  return (
    <div className="flex gap-3">
      <div className="w-36"> {/* Adjusted width for phone code select */}
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