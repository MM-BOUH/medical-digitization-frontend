export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:80';

export const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url}`;
};

export const validateIds = async (patientId, healthcareWorkerId) => {
  const response = await fetch(`${BASE_URL}/api/validate-ids/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id: patientId, healthcare_worker_id: healthcareWorkerId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Validation failed');
  return data;
};
/**
 * Digitize a medical report without linking to PHC (no patient/worker IDs, nothing saved to DB)
 * @param {File} imageFile - The medical report image file
 * @returns {Promise<Object>} Response containing classification and extraction results
 */
export const digitizeAnonymous = async (imageFile) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${BASE_URL}/smrd/digitize-anonymous/`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server may be starting up — please try again in a moment.');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Could not reach the server. Check your internet connection or try again shortly.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Digitize a medical report by uploading an image
 * @param {File} imageFile - The medical report image file
 * @param {string|number} patientId - Patient ID
 * @param {string|number} healthcareWorkerId - Healthcare worker/operator ID
 * @returns {Promise<Object>} Response containing classification and extraction results
 */
export const digitizeReport = async (imageFile, patientId, healthcareWorkerId) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min for cold start + AI processing

  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('patient_id', patientId);
    formData.append('healthcare_worker_id', healthcareWorkerId);

    const response = await fetch(`${BASE_URL}/smrd/digitize/`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server may be starting up — please try again in a moment.');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Could not reach the server. Check your internet connection or try again shortly.');
    }
    console.error('Error digitizing report:', error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Save extracted data to database
 */
export const saveExtractedData = async (formData) => {
  const response = await fetch(`${BASE_URL}/smrd/store/`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save extracted data');
  }
  
  return response.json();
};

/**
 * Fetch all medical reports with optional filters and pagination
 * @param {string} patientId - Optional patient ID filter
 * @param {string} reportType - Optional report type filter
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Paginated response with results and metadata
 */
 export const fetchAllMedicalReports = async (patientId = null, reportType = null, page = 1) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add page parameter
    params.append('page', page);
    
    // Only add patient_id if it's provided and not empty
    if (patientId && patientId.toString().trim()) {
      params.append('patient_id', patientId.toString().trim());
    }
    
    // Only add report_type if it's provided and not 'all'
    if (reportType && reportType !== 'all') {
      params.append('report_type', reportType);
    }
    
    const queryString = params.toString();
    const url = `${BASE_URL}/smrd/reports/${queryString ? '?' + queryString : ''}`;
    
    console.log('Fetching reports from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to fetch reports: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    // Return the full paginated response
    return data;
  } catch (error) {
    console.error('Error in fetchAllMedicalReports:', error);
    throw error;
  }
};

/**
 * Fetch medical reports for a specific patient (using POST endpoint)
 * @param {string|number} patientId - Patient ID
 * @returns {Promise<Array>} Array of medical reports for the patient
 */
export const fetchPatientReports = async (patientId) => {
  try {
    const response = await fetch(`${BASE_URL}/smrd/patient/reports/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patient_id: patientId }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch patient reports: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle paginated response
    if (data && data.results) {
      return data.results;
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in fetchPatientReports:', error);
    throw error;
  }
};

/**
 * Fetch patients list (if needed for dropdown)
 * @returns {Promise<Array>} List of patients
 */
export const fetchPatients = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/patients/`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

/**
 * Fetch healthcare workers list (if needed for dropdown)
 * @returns {Promise<Array>} List of healthcare workers
 */
export const fetchHealthcareWorkers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/operators/`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch healthcare workers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching healthcare workers:', error);
    throw error;
  }
};


/**
 * Fetch details of a specific medical report
 * @param {number} reportId - Report ID
 * @returns {Promise<Object>} Report details
 */
 export const fetchReportDetail = async (reportId) => {
  try {
    const response = await fetch(`${BASE_URL}/smrd/report/detail/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ report_id: reportId }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch report details: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchReportDetail:', error);
    throw error;
  }
};

/**
 * Update an existing medical report
 * @param {number} reportId - Report ID to update
 * @param {FormData} formData - Form data with updated fields
 * @returns {Promise<Object>} Updated report data
 */
 export const updateExtractedData = async (reportId, formData) => {
  try {
    // Add report_id to formData
    formData.append('report_id', reportId);
    
    const response = await fetch(`${BASE_URL}/smrd/report/update/`, {
      method: 'PUT',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update report');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};