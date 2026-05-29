import React from 'react';

/**
 * StatusIndicator Component
 * Displays the current status of the digitization process with animations
 * Supports: analyzing, classified, extracting, success, error, not-medical
 */
const StatusIndicator = ({ status, message, reportType }) => {
  // Determine which state we're in
  const isAnalyzing = status === 'analyzing';
  const isExtracting = status === 'extracting';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isNotMedical = status === 'not-medical';
  const isClassified = status === 'classified';

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] p-4 sm:p-6 md:p-8">
      {/* Icon Container */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        {(isAnalyzing || isExtracting) && (
          <div className="relative">
            {/* Spinning circle animation */}
            <svg
              className="animate-spin text-blue-500 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {isSuccess && (
          <div className="text-green-500 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
            {/* Success checkmark */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-full h-full"
              aria-label="Success"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}

        {(isError || isNotMedical) && (
          <div className="text-red-500 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
            {/* Error X icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-full h-full"
              aria-label="Error"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}

        {isClassified && (
          <div className="text-blue-500 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
            {/* Document check icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-full h-full"
              aria-label="Classified"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center max-w-md mx-auto">
        <p
          className={`text-sm sm:text-base md:text-lg font-semibold mb-2 ${
            isSuccess
              ? 'text-green-600'
              : isError || isNotMedical
              ? 'text-red-600'
              : 'text-gray-800'
          }`}
        >
          {message}
        </p>

        {/* Hint during long server wait */}
        {isAnalyzing && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            This may take up to 60 seconds if the server is starting up.
          </p>
        )}

        {/* Show report type if classified */}
        {reportType && isClassified && (
          <p className="text-xs sm:text-sm md:text-base text-blue-600 font-medium mt-2">
            Report Type: {reportType}
          </p>
        )}
      </div>

      {/* Additional styling for smooth transitions */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Fallback for browsers that don't support CSS animations */
        @supports not (animation: spin 1s linear infinite) {
          .animate-spin {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default StatusIndicator;
