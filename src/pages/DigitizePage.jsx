import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import StatusIndicator from '../components/StatusIndicator';
import ExtractionModal from '../components/ExtractionModal';
import { digitizeReport, digitizeAnonymous } from '../actions/medicalReports';

const DigitizePage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // null | 'phc' | 'anonymous'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [reportType, setReportType] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [healthcareWorkerId, setHealthcareWorkerId] = useState('');


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (mode === 'phc' && (!patientId || !healthcareWorkerId)) {
      alert('Please enter both Patient ID and Healthcare Worker ID');
      return;
    }

    if (mode === 'phc' && (!/^\d+$/.test(patientId.trim()) || !/^\d+$/.test(healthcareWorkerId.trim()))) {
      alert('Invalid patient ID or healthcare worker ID');
      return;
    }

    setIsUploading(true);
    setStatus('analyzing');
    setStatusMessage('Analyzing document...');

    try {
      const response = mode === 'phc'
        ? await digitizeReport(selectedFile, patientId, healthcareWorkerId)
        : await digitizeAnonymous(selectedFile);

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

      setReportType(response.report_type);
      setStatus('classified');
      setStatusMessage(`Classified as ${response.report_type}`);

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
      setStatus('error');
      setStatusMessage(error.message || 'An error occurred during digitization');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    navigate('/reports');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setStatus('idle');
    setStatusMessage('');
    setReportType('');
    setExtractedData(null);
    setShowModal(false);
  };

  const handleChangeMode = () => {
    handleReset();
    setMode(null);
    setPatientId('');
    setHealthcareWorkerId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Medical Report Digitization
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              <span className="sm:hidden">Scan and digitize medical reports</span>
              <span className="hidden sm:inline">Upload scanned medical reports for automatic classification and data extraction</span>
            </p>
          </div>
        </div>
      </header>

      {/* Mode selection */}
      {mode === null && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-8">
            How would you like to proceed?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('phc')}
              className="group flex flex-col items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-blue-500 p-8 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-1">PHC Mode</h3>
                <p className="text-sm text-gray-500">Link to a patient and healthcare worker. Report is saved to the PHC system.</p>
              </div>
              <span className="mt-auto px-4 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">Save to PHC</span>
            </button>

            <button
              onClick={() => setMode('anonymous')}
              className="group flex flex-col items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-green-500 p-8 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Scan & Extract</h3>
                <p className="text-sm text-gray-500">No patient ID needed. Scan any report and export the result as JSON or CSV.</p>
              </div>
              <span className="mt-auto px-4 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-full">Export JSON / CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Digitize form */}
      {mode !== null && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-10">
            {/* Mode badge + View Reports (PHC only) + change */}
            <div className="flex flex-col gap-3 mb-6">
              {/* Top row: badge + change mode */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${mode === 'phc' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {mode === 'phc' ? 'PHC Mode' : 'Scan & Extract'}
                </span>
                <button
                  onClick={handleChangeMode}
                  className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                >
                  Change mode
                </button>
              </div>
              {/* View Reports — full width on mobile, auto on desktop */}
              {mode === 'phc' && (
                <button
                  type="button"
                  onClick={() => navigate('/reports')}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Reports
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PHC-only: Patient ID + Healthcare Worker ID */}
              {mode === 'phc' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="patientId" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
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
                  <div>
                    <label htmlFor="healthcareWorkerId" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
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
              )}

              {/* File Uploader */}
              <FileUploader
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                disabled={isUploading}
              />

              {/* Status */}
              {status !== 'idle' && (
                <div className="mt-8">
                  <StatusIndicator status={status} message={statusMessage} reportType={reportType} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8">
                {(status === 'idle' || status === 'error' || status === 'not-medical') ? (
                  <>
                    <button
                      type="submit"
                      disabled={
                        !selectedFile ||
                        (mode === 'phc' && (!patientId || !healthcareWorkerId)) ||
                        isUploading
                      }
                      className="px-6 py-3.5 md:px-8 text-sm md:text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg shadow-md transition-colors w-full sm:w-auto"
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

          {/* How it works */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 sm:p-8">
            <h2 className="text-lg md:text-xl font-semibold text-blue-900 mb-4">How It Works</h2>
            <ol className="space-y-3 text-sm md:text-base text-blue-800">
              {mode === 'phc' ? (
                <>
                  <li className="flex items-start gap-3"><StepBadge n={1} />Select a patient and healthcare worker from the PHC system</li>
                  <li className="flex items-start gap-3"><StepBadge n={2} />Upload a clear scan or photo of the medical report (JPG, PNG, or PDF)</li>
                  <li className="flex items-start gap-3"><StepBadge n={3} />The system classifies the report type and extracts structured data</li>
                  <li className="flex items-start gap-3"><StepBadge n={4} />Review and edit the extracted data before saving</li>
                  <li className="flex items-start gap-3"><StepBadge n={5} />Confirm and save the digitized report to the PHC database</li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-3"><StepBadge n={1} />Upload a clear scan or photo of the medical report (JPG, PNG, or PDF)</li>
                  <li className="flex items-start gap-3"><StepBadge n={2} />The system classifies the report type and extracts structured data</li>
                  <li className="flex items-start gap-3"><StepBadge n={3} />Review and edit the extracted data</li>
                  <li className="flex items-start gap-3"><StepBadge n={4} />Export the result as JSON or CSV — nothing is saved to the database</li>
                </>
              )}
            </ol>
          </div>
        </main>
      )}

      {/* Extraction Modal */}
      <ExtractionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        extractedData={extractedData}
        imageFile={selectedFile}
        reportType={reportType}
        patientId={patientId}
        healthcareWorkerId={healthcareWorkerId}
        onSaveSuccess={handleSaveSuccess}
        isAnonymous={mode === 'anonymous'}
      />
    </div>
  );
};

const StepBadge = ({ n }) => (
  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
    {n}
  </span>
);


export default DigitizePage;
