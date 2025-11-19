import React, { useState } from 'react';

/**
 * EditableField Component
 * Allows inline editing of field names and values
 * Supports cross-browser input handling
 */
const EditableField = ({ label, value, onLabelChange, onValueChange, onDelete, isMetadata = false }) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);

  return (
    <div className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 rounded-md hover:bg-gray-50 transition-colors">
      {/* Label/Field Name */}
      <div className="flex-shrink-0 w-full sm:w-1/3">
        {isEditingLabel ? (
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            onBlur={() => setIsEditingLabel(false)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setIsEditingLabel(false);
              }
            }}
            className="w-full px-3 py-2 text-sm md:text-base rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
            disabled={isMetadata}
            aria-label="Field name"
          />
        ) : (
          <button
            onClick={() => !isMetadata && setIsEditingLabel(true)}
            className={`w-full text-left px-3 py-2 text-sm md:text-base font-medium text-gray-700 rounded-md ${
              !isMetadata ? 'hover:bg-gray-100 cursor-text' : 'cursor-default'
            }`}
            aria-label={`Edit ${label}`}
          >
            {label}
          </button>
        )}
      </div>

      {/* Value */}
      <div className="flex-grow flex items-start gap-2">
        {isEditingValue ? (
          <textarea
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onBlur={() => setIsEditingValue(false)}
            className="w-full px-3 py-2 text-sm md:text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y min-h-[40px]"
            autoFocus
            rows={1}
            aria-label={`${label} value`}
          />
        ) : (
          <button
            onClick={() => setIsEditingValue(true)}
            className="flex-grow text-left px-3 py-2 text-sm md:text-base text-gray-900 rounded-md hover:bg-gray-100 cursor-text border border-transparent hover:border-gray-300 transition-all"
            aria-label={`Edit ${label} value`}
          >
            {value || <span className="text-gray-400 italic">No value</span>}
          </button>
        )}

        {/* Delete Button (only for non-metadata fields) */}
        {!isMetadata && onDelete && (
          <button
            onClick={onDelete}
            className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Delete ${label}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default EditableField;
