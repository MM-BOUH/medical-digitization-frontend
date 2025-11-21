import React from 'react';

/**
 * ReportCard Component
 * Displays a single medical report in card format
 */
const ReportCard = ({ report, onView }) => {
  const metadata = report.extracted_data?.metadata || {};
  const reportTypeColors = {
    'Hematology': 'bg-red-100 text-red-800',
    'Clinical Chemistry': 'bg-blue-100 text-blue-800',
    'Microbiology': 'bg-green-100 text-green-800',
    'Urinalysis': 'bg-yellow-100 text-yellow-800',
    'Serology/Immunology': 'bg-purple-100 text-purple-800',
  };

  const colorClass = reportTypeColors[report.report_type] || 'bg-gray-100 text-gray-800';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image Preview */}
      <div className="h-48 bg-gray-900 overflow-hidden">
        {report.image ? (
          <img
            src={report.image}
            alt="Medical Report"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Report Type Badge */}
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClass} mb-3`}
        >
          {report.report_type}
        </span>

        {/* Patient Info */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
          {metadata.patient_name || 'Unknown Patient'}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>
              {metadata.age ? `${metadata.age} years` : 'Age N/A'} • {metadata.gender || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(metadata.report_date || report.created_at)}</span>
          </div>

          {metadata.lab_name && (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="truncate">{metadata.lab_name}</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <button
          onClick={onView}
          className="w-full px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ReportCard;