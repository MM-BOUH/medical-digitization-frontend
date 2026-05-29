import React, { useState, useRef, useEffect } from 'react';

/**
 * SearchableSelect
 * Props:
 *   options   – [{ value, label }]
 *   value     – currently selected value (id)
 *   onChange  – (value, label) => void
 *   placeholder
 *   isLoading
 *   error
 *   disabled
 */
const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Search...',
  isLoading = false,
  error = null,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Keep displayed text in sync when value is cleared externally
  const selectedLabel = options.find((o) => String(o.value) === String(value))?.label ?? '';
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!value) setInputText('');
  }, [value]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (option) => {
    setInputText(option.label);
    setQuery('');
    setOpen(false);
    onChange(option.value, option.label);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) onChange('', '');
  };

  const handleClear = () => {
    setInputText('');
    setQuery('');
    setOpen(false);
    onChange('', '');
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
        // If user typed but didn't pick, restore selected label
        setInputText(selectedLabel);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [selectedLabel]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={isLoading ? 'Loading...' : placeholder}
          disabled={disabled || isLoading}
          className={`w-full px-3 py-2 md:px-4 md:py-2.5 pr-10 text-sm md:text-base rounded-md border transition-all
            ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}
            focus:ring-2 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
        />

        {/* Right icon: spinner, clear, or chevron */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : value ? (
            <button
              type="button"
              onClick={handleClear}
              className="pointer-events-auto text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {/* Error hint */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Dropdown */}
      {open && !isLoading && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500 text-center">No results found</li>
          ) : (
            filtered.map((option) => (
              <li
                key={option.value}
                onMouseDown={() => handleSelect(option)}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-blue-50
                  ${String(option.value) === String(value) ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-800'}`}
              >
                <span>{option.label}</span>
                <span className="text-xs text-gray-400">#{option.value}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
