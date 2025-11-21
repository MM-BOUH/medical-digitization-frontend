import React, { useState, useEffect } from 'react';
import EditableField from './EditableField';
import { saveExtractedData } from '../actions/medicalReports';

/**
 * ExtractionModal Component
 * Displays extracted data in a split-screen layout with image preview and editable fields
 * Fully responsive with mobile, tablet, and desktop layouts
 */
const ExtractionModal = ({ 
  isOpen, 
  onClose, 
  extractedData, 
  imageFile, 
  reportType: initialReportType, 
  patientId, 
  healthcareWorkerId,
  onSaveSuccess 
}) => {
  const [metadata, setMetadata] = useState({});
  const [results, setResults] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [reportType, setReportType] = useState(initialReportType || '');

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen && extractedData) {
      setMetadata(extractedData.metadata || {});
      setResults(extractedData.results || []);
      setShowSuccessMessage(false);
      setErrorMessage('');
      setReportType(initialReportType || '');
    }
  }, [isOpen, extractedData, initialReportType]);

  // Create image preview URL
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  // Prevent body scroll when modal is open (cross-browser)
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /**
   * Handle metadata field changes
   */
  const handleMetadataChange = (key, value) => {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Handle result field changes
   */
  const handleResultChange = (resultIndex, dataIndex, field, value) => {
    setResults((prev) => {
      const newResults = [...prev];
      if (!newResults[resultIndex]) return prev;

      if (field === 'result_type') {
        newResults[resultIndex].result_type = value;
      } else if (field === 'text_data') {
        newResults[resultIndex].text_data = value;
      } else {
        // Modifying result_data array
        const resultData = [...(newResults[resultIndex].result_data || [])];
        if (resultData[dataIndex]) {
          resultData[dataIndex] = {
            ...resultData[dataIndex],
            [field]: value,
          };
          newResults[resultIndex].result_data = resultData;
        }
      }

      return newResults;
    });
  };

  /**
   * Add new field to a result section
   */
  const handleAddField = (resultIndex) => {
    setResults((prev) => {
      const newResults = [...prev];
      if (!newResults[resultIndex].result_data) {
        newResults[resultIndex].result_data = [];
      }
      newResults[resultIndex].result_data.push({
        test_name: 'New Test',
        value: '',
        unit: '',
        reference_range: '',
      });
      return newResults;
    });
  };

  /**
   * Delete a field from result section
   */
  const handleDeleteField = (resultIndex, dataIndex) => {
    setResults((prev) => {
      const newResults = [...prev];
      if (newResults[resultIndex]?.result_data) {
        newResults[resultIndex].result_data = newResults[resultIndex].result_data.filter(
          (_, idx) => idx !== dataIndex
        );
      }
      return newResults;
    });
  };

  /**
   * Add new result section
   */
  const handleAddResultSection = () => {
    setResults((prev) => [
      ...prev,
      {
        result_type: 'New Section',
        result_data: [],
        text_data: '',
        image_data: '',
        other_fields: {},
      },
    ]);
  };

  /**
   * Delete result section
   */
  const handleDeleteResultSection = (resultIndex) => {
    setResults((prev) => prev.filter((_, idx) => idx !== resultIndex));
  };

  /**
   * Handle form confirmation and save to backend
   */
  const handleConfirm = async () => {
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      // Prepare the edited extracted data
      const editedExtractedData = {
        metadata,
        results,
      };

      // Prepare FormData for backend
      const formData = new FormData();
      formData.append('patient_id', patientId);
      formData.append('healthcare_worker_id', healthcareWorkerId);
      formData.append('image', imageFile); // Original image file
      formData.append('report_type', reportType); // Use the updated report type
      formData.append('extracted_data', JSON.stringify(editedExtractedData));

      // Call the API to save
      const result = await saveExtractedData(formData);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Close modal after 1.5 seconds and notify parent
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
        if (onSaveSuccess) {
          onSaveSuccess(result);
        }
      }, 1500);

    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage('Failed to save data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle zoom controls
   */
  const handleZoomIn = () => setImageZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setImageZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setImageZoom(1);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      style={{ WebkitBackdropFilter: 'blur(4px)' }} // Safari fallback
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="w-full h-full md:w-[90%] md:h-[90%] lg:w-[85%] lg:h-[85%] max-w-7xl bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
              Review Extracted Data
            </h2>
            {/* Editable Report Type Dropdown */}
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor="reportType" className="text-xs md:text-sm font-medium text-gray-600">
                Report Type:
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-1 text-xs md:text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              >
                <option value="Hematology">Hematology</option>
                <option value="Clinical Chemistry">Clinical Chemistry</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Urinalysis">Urinalysis</option>
                <option value="Serology/Immunology">Serology/Immunology</option>
              </select>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Success/Error Messages */}
        {showSuccessMessage && (
          <div className="mx-4 mt-4 md:mx-6 md:mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-green-800 font-medium">Data saved successfully!</p>
          </div>
        )}

        {errorMessage && (
          <div className="mx-4 mt-4 md:mx-6 md:mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Content - Split Layout */}
        <div className="flex-grow flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 overflow-hidden">
          {/* LEFT SIDE - Image Preview */}
          <div className="w-full md:w-2/5 h-[40vh] md:h-full bg-gray-900 rounded-lg flex flex-col overflow-hidden">
            {/* Zoom Controls */}
            <div className="flex items-center justify-center gap-2 p-2 bg-gray-800">
              <button
                onClick={handleZoomOut}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="text-white text-sm font-medium">{Math.round(imageZoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                onClick={handleZoomReset}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm ml-2"
                aria-label="Reset zoom"
              >
                Reset
              </button>
            </div>

            {/* Image Container */}
            <div className="flex-grow overflow-auto flex items-center justify-center p-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Medical Report"
                  className="max-w-full h-auto object-contain"
                  style={{
                    transform: `scale(${imageZoom})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p>No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - Extracted Data Form */}
          <div className="w-full md:w-3/5 overflow-y-auto space-y-4 md:space-y-6">
            {/* Metadata Section */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
                Patient Information
              </h3>
              <div className="space-y-3 md:space-y-4">
                {Object.entries(metadata).map(([key, value]) => (
                  <EditableField
                    key={key}
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    value={value}
                    onLabelChange={() => {}} // Metadata labels are fixed
                    onValueChange={(newValue) => handleMetadataChange(key, newValue)}
                    isMetadata={true}
                  />
                ))}
              </div>
            </div>

            {/* Results Sections */}
            {results.map((result, resultIndex) => (
              <div
                key={resultIndex}
                className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={result.result_type || 'Results'}
                    onChange={(e) =>
                      handleResultChange(resultIndex, null, 'result_type', e.target.value)
                    }
                    className="text-base md:text-lg font-semibold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                    aria-label="Section title"
                  />
                  <button
                    onClick={() => handleDeleteResultSection(resultIndex)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    aria-label="Delete section"
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
                </div>

                {/* Result Data Fields */}
                <div className="space-y-2">
                  {result.result_data?.map((data, dataIndex) => (
                    <div key={dataIndex} className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <EditableField
                          label="Test Name"
                          value={data.test_name || ''}
                          onLabelChange={() => {}}
                          onValueChange={(newValue) =>
                            handleResultChange(resultIndex, dataIndex, 'test_name', newValue)
                          }
                        />
                        <EditableField
                          label="Value"
                          value={data.value || ''}
                          onLabelChange={() => {}}
                          onValueChange={(newValue) =>
                            handleResultChange(resultIndex, dataIndex, 'value', newValue)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <EditableField
                          label="Unit"
                          value={data.unit || ''}
                          onLabelChange={() => {}}
                          onValueChange={(newValue) =>
                            handleResultChange(resultIndex, dataIndex, 'unit', newValue)
                          }
                        />
                        <EditableField
                          label="Reference Range"
                          value={data.reference_range || ''}
                          onLabelChange={() => {}}
                          onValueChange={(newValue) =>
                            handleResultChange(resultIndex, dataIndex, 'reference_range', newValue)
                          }
                          onDelete={() => handleDeleteField(resultIndex, dataIndex)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Text Data */}
                {result.text_data && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={result.text_data}
                      onChange={(e) =>
                        handleResultChange(resultIndex, null, 'text_data', e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm md:text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                      rows={3}
                      aria-label="Additional notes"
                    />
                  </div>
                )}

                {/* Add Field Button */}
                <button
                  onClick={() => handleAddField(resultIndex)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                  aria-label="Add new field"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Field
                </button>
              </div>
            ))}

            {/* Add Result Section Button */}
            <button
              onClick={handleAddResultSection}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors border-2 border-dashed border-gray-300"
              aria-label="Add new section"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Section
            </button>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSaving}
            className="px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            aria-label="Confirm and save"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                Saving...
              </>
            ) : (
              'Confirm & Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtractionModal;