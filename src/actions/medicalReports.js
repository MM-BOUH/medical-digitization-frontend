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
 * Save the confirmed extracted data back to the backend
 * @param {Object} reportData - The confirmed medical report data
 * @returns {Promise<Object>} Response from the server
 */
export const saveExtractedData = async (reportData) => {
  try {
    const response = await fetch(`${BASE_URL}/smrd/save-extracted-data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save extracted data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving extracted data:', error);
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
