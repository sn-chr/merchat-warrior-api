import { useState } from 'react';
import { Search, ChevronDown } from 'react-feather';

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  renderOption,
  renderSelected,
  filterOption,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option => 
    !option.disabled && filterOption(option, searchTerm)
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <div
        className={`w-full p-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer flex items-center justify-between ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {renderSelected ? renderSelected(selectedOption) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDown className="w-5 h-5 text-gray-400 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto select-dropdown">
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="py-1">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-blue-50 cursor-pointer ${
                  value === option.value ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {renderOption(option)}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 