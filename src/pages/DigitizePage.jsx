import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import FileUploader from '../components/FileUploader';
import StatusIndicator from '../components/StatusIndicator';
import ExtractionModal from '../components/ExtractionModal';
import { digitizeReport } from '../actions/medicalReports';

/**
 * DigitizePage Component
 * Main page for medical report digitization workflow
 * Handles file upload, classification, extraction, and data confirmation
 */
const DigitizePage = () => {
  const navigate = useNavigate(); // Add this
  
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [reportType, setReportType] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form inputs for patient and healthcare worker IDs
  const [patientId, setPatientId] = useState('');
  const [healthcareWorkerId, setHealthcareWorkerId] = useState('');

  /**
   * Handle file selection from FileUploader
   */
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      setStatus('idle');
      setStatusMessage('');
      setReportType('');
      setExtractedData(null);
      setShowModal(false);
    }
  };

  /**
   * Handle form submission - Start digitization process
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!patientId || !healthcareWorkerId) {
      alert('Please enter both Patient ID and Healthcare Worker ID');
      return;
    }

    setIsUploading(true);
    setStatus('analyzing');
    setStatusMessage('Analyzing document...');

    try {
      const response = await digitizeReport(selectedFile, patientId, healthcareWorkerId);

      if (response.error) {
        if (response.error.includes('not a valid medical report')) {
          setStatus('not-medical');
          setStatusMessage('Not a medical report');
        } else {
          setStatus('error');
          setStatusMessage(response.error);
        }
        setIsUploading(false);
        return;
      }

      const classifiedType = response.report_type;
      setReportType(classifiedType);
      setStatus('classified');
      setStatusMessage(`Classified as ${classifiedType}`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('extracting');
      setStatusMessage('Extracting data...');

      if (response.extracted_data) {
        setExtractedData(response.extracted_data);
        setStatus('success');
        setStatusMessage('Extraction complete!');
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        setShowModal(true);
      } else {
        setStatus('error');
        setStatusMessage('Failed to extract data');
      }

    } catch (error) {
      console.error('Digitization error:', error);
      setStatus('error');
      setStatusMessage(error.message || 'An error occurred during digitization');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handle successful save from modal - Navigate to reports list
   */
  const handleSaveSuccess = (result) => {
    console.log('Data saved successfully:', result);
    
    // Close modal
    setShowModal(false);
    
    // Navigate to reports list page immediately - NO ALERT
    navigate('/reports');
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setShowModal(false);
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setStatus('idle');
    setStatusMessage('');
    setReportType('');
    setExtractedData(null);
    setShowModal(false);
  };

  /**
   * Navigate to reports list
   */
  const handleViewReports = () => {
    navigate('/reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Medical Report Digitization
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Upload scanned medical reports for automatic classification and data extraction
              </p>
            </div>
            <button
              onClick={handleViewReports}
              className="flex items-center gap-2 px-5 py-2.5 text-sm md:text-base font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Reports
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Patient ID */}
              <div>
                <label
                  htmlFor="patientId"
                  className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                >
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID"
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isUploading}
                />
              </div>

              {/* Healthcare Worker ID */}
              <div>
                <label
                  htmlFor="healthcareWorkerId"
                  className="block text-sm md:text-base font-medium text-gray-700 mb-2"
                >
                  Healthcare Worker ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="healthcareWorkerId"
                  value={healthcareWorkerId}
                  onChange={(e) => setHealthcareWorkerId(e.target.value)}
                  placeholder="Enter healthcare worker ID"
                  className="w-full px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* File Uploader */}
            <div className="mt-8">
              <FileUploader
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                disabled={isUploading}
              />
            </div>

            {/* Status Display */}
            {status !== 'idle' && (
              <div className="mt-8">
                <StatusIndicator
                  status={status}
                  message={statusMessage}
                  reportType={reportType}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8">
              {status === 'idle' || status === 'error' || status === 'not-medical' ? (
                <>
                  <button
                    type="submit"
                    disabled={!selectedFile || !patientId || !healthcareWorkerId || isUploading}
                    className="px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors w-full sm:w-auto"
                  >
                    Start Digitization
                  </button>

                  {(status === 'error' || status === 'not-medical') && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition-colors w-full sm:w-auto"
                    >
                      Try Another File
                    </button>
                  )}
                </>
              ) : status === 'success' ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition-colors w-full sm:w-auto"
                >
                  Digitize Another Report
                </button>
              ) : null}
            </div>
          </form>
        </div>

        {/* Instructions Card */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 sm:p-8">
          <h2 className="text-lg md:text-xl font-semibold text-blue-900 mb-4">
            How It Works
          </h2>
          <ol className="space-y-3 text-sm md:text-base text-blue-800">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                1
              </span>
              <span>Enter the Patient ID and Healthcare Worker ID</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                2
              </span>
              <span>Upload a clear scan or photo of the medical report (JPG, PNG, or PDF)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                3
              </span>
              <span>
                The system will automatically classify the report type (Hematology, Clinical
                Chemistry, etc.)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                4
              </span>
              <span>Review and edit the extracted data before saving</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                5
              </span>
              <span>Confirm and save the digitized report to the database</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Extraction Modal */}
      <ExtractionModal
        isOpen={showModal}
        onClose={handleModalClose}
        extractedData={extractedData}
        imageFile={selectedFile}
        reportType={reportType}
        patientId={patientId}
        healthcareWorkerId={healthcareWorkerId}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default DigitizePage;