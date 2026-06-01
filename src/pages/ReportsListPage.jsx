import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllMedicalReports, validateIds } from '../actions/medicalReports';
import ReportCard from '../components/ReportCard';

const ReportsListPage = () => {
  const navigate = useNavigate();

  // Validation gate
  const [patientId, setPatientId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validated, setValidated] = useState(false);

  // Reports
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const loadReports = async (page = 1, type = filterType) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchAllMedicalReports(
        patientId,
        type !== 'all' ? type : null,
        page
      );
      setReports(data.results || []);
      setTotalPages(data.total_pages || 1);
      setTotalItems(data.total_items || 0);
      setPageSize(data.page_size || 10);
      setCurrentPage(data.current_page || 1);
    } catch {
      setError('Failed to load reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!/^\d+$/.test(patientId.trim()) || !/^\d+$/.test(workerId.trim())) {
      setValidationError('Invalid patient ID or healthcare worker ID');
      return;
    }

    setValidating(true);
    try {
      const result = await validateIds(patientId.trim(), workerId.trim());
      if (result.valid) {
        setValidated(true);
        loadReports(1, 'all');
      } else {
        setValidationError('Invalid patient ID or healthcare worker ID');
      }
    } catch {
      setValidationError('Invalid patient ID or healthcare worker ID');
    } finally {
      setValidating(false);
    }
  };

  const handleBack = () => {
    setValidated(false);
    setReports([]);
    setFilterType('all');
    setError('');
    setValidationError('');
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    loadReports(1, type);
  };

  const handleClear = () => {
    setFilterType('all');
    loadReports(1, 'all');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadReports(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Medical Reports
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                View and manage digitized medical reports
              </p>
            </div>
            <button
              onClick={() => navigate('/digitize')}
              className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Digitize New Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">

        {/* Validation gate */}
        {!validated && (
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Patient Access</h2>
            <p className="text-sm text-gray-500 mb-6">Enter valid IDs to view that patient's reports.</p>

            <form onSubmit={handleValidate} className="space-y-4">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patientId"
                  value={patientId}
                  onChange={(e) => { setPatientId(e.target.value); setValidationError(''); }}
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="workerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Healthcare Worker ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="workerId"
                  value={workerId}
                  onChange={(e) => { setWorkerId(e.target.value); setValidationError(''); }}
                  placeholder="Enter healthcare worker ID"
                  className="w-full px-4 py-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {validationError && (
                <p className="text-sm text-red-600">{validationError}</p>
              )}

              <button
                type="submit"
                disabled={validating || !patientId.trim() || !workerId.trim()}
                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {validating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Validating...
                  </>
                ) : 'View Reports'}
              </button>
            </form>
          </div>
        )}

        {/* Reports view */}
        {validated && (
          <>
            {/* Filter bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Change patient
                </button>

                <div className="flex-1">
                  <select
                    value={filterType}
                    onChange={(e) => handleFilterTypeChange(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm md:text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Report Types</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Clinical Chemistry">Clinical Chemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Urinalysis">Urinalysis</option>
                    <option value="Serology/Immunology">Serology/Immunology</option>
                  </select>
                </div>

                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600">Loading reports...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-medium mb-4">{error}</p>
                <button
                  onClick={() => loadReports()}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Reports grid */}
            {!isLoading && !error && reports.length > 0 && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalItems)} of {totalItems} report{totalItems !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {reports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onView={() => navigate(`/reports/${report.id}`)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </span>
                    </button>
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            pageNum === currentPage
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!isLoading && !error && reports.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-6">
                  {filterType !== 'all'
                    ? 'No reports match this type. Try a different filter.'
                    : 'No reports have been digitized for this patient yet.'}
                </p>
                <button
                  onClick={() => navigate('/digitize')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition-colors"
                >
                  Digitize New Report
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ReportsListPage;
