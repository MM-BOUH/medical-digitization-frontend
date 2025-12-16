import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReportDetail } from '../actions/medicalReports';
import ReportDetailModal from '../components/ReportDetailModal';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReportDetails();
  }, [id]);

  const loadReportDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchReportDetail(id);
      setReport(data);
    } catch (err) {
      console.error('Error fetching report details:', err);
      setError('Failed to load report details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/reports');
  };

  // Handle successful update - refresh report data
  const handleUpdateSuccess = (updatedReport) => {
    setReport(updatedReport);
    // Optionally show a toast notification
    console.log('Report updated successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
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
          <p className="text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Report</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadReportDetails}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReportDetailModal
      isOpen={true}
      onClose={handleClose}
      report={report}
      onUpdateSuccess={handleUpdateSuccess}
    />
  );
};

export default ReportDetailPage;