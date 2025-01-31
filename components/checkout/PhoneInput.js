import { useState, useEffect } from 'react';
import { validatePhone, formatPhone, getPhoneError } from '../../utils/phoneUtils';
import { Search, ChevronDown } from 'react-feather';
import { phoneCodes } from '../../utils/constants/phoneCodes';

export function PhoneInput({ countryCode, phone, onPhoneChange, onCountryChange, required }) {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter phone codes based on search
  const filteredCodes = phoneCodes
    .filter(country => !country.disabled)
    .filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.phoneCode.includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Get selected country
  const selectedCountry = phoneCodes.find(c => c.code === countryCode && !c.disabled);

  // Validate on value change
  useEffect(() => {
    if (touched) {
      setError(getPhoneError(phone, countryCode));
    }
  }, [phone, countryCode, touched]);

  const handleChange = (e) => {
    const formattedPhone = formatPhone(e.target.value, countryCode);
    onPhoneChange(formattedPhone);
  };

  const handleBlur = () => {
    setTouched(true);
    setError(getPhoneError(phone, countryCode));
  };

  const handleCountryChange = (code) => {
    // Only update phone code, not the main country
    onCountryChange(code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.phone-select-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div>
      <div className="flex gap-2">
        {/* Phone Code Select */}
        <div className="w-32 relative phone-select-dropdown">
          <div
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              {selectedCountry && (
                <>
                  <img 
                    src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-5 h-3 object-cover rounded-sm"
                  />
                  <span>+{selectedCountry.phoneCode}</span>
                </>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {isOpen && (
            <div className="absolute z-50 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search country or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              <div className="py-1">
                {filteredCodes.map((country) => (
                  <div
                    key={country.code}
                    className={`px-4 py-2 flex items-center gap-3 hover:bg-blue-50 cursor-pointer ${
                      countryCode === country.code ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleCountryChange(country.code)}
                  >
                    <img 
                      src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                      alt={country.name}
                      className="w-5 h-3 object-cover rounded-sm"
                    />
                    <span className="font-medium">+{country.phoneCode}</span>
                    <span className="text-sm text-gray-600">{country.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Input */}
        <div className="flex-1">
          <input
            type="tel"
            value={phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            placeholder="Enter phone number"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Include country code and area code
      </p>
    </div>
  );
} 