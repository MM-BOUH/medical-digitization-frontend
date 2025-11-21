// API Base URL - Update this to match your Django backend
const BASE_URL = 'http://localhost:80';

/**
 * Digitize a medical report by uploading an image
 * @param {File} imageFile - The medical report image file
 * @param {string|number} patientId - Patient ID
 * @param {string|number} healthcareWorkerId - Healthcare worker/operator ID
 * @returns {Promise<Object>} Response containing classification and extraction results
 */
export const digitizeReport = async (imageFile, patientId, healthcareWorkerId) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('patient_id', patientId);
    formData.append('healthcare_worker_id', healthcareWorkerId);

    const response = await fetch(`${BASE_URL}/smrd/digitize/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to digitize report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error digitizing report:', error);
    throw error;
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
