/**
 * Utility functions for managing Stream.io call recordings
 */

/**
 * Retrieve all recordings for a given call
 * @param {Object} call - The Stream.io call object
 * @returns {Promise<Array>} Array of recording objects
 */
export const getCallRecordings = async (call) => {
  try {
    const response = await call.listRecordings();
    return response.recordings || [];
  } catch (error) {
    console.error("Error fetching recordings:", error);
    throw error;
  }
};

/**
 * Retrieve recordings for a specific call session
 * @param {Object} call - The Stream.io call object
 * @param {string} callSessionId - The specific session ID
 * @returns {Promise<Array>} Array of recording objects for that session
 */
export const getSessionRecordings = async (call, callSessionId) => {
  try {
    const response = await call.listRecordings(callSessionId);
    return response.recordings || [];
  } catch (error) {
    console.error("Error fetching session recordings:", error);
    throw error;
  }
};

/**
 * Get download URL for a recording
 * @param {Object} recording - Recording object from queryRecordings
 * @returns {string} Download URL
 */
export const getRecordingDownloadUrl = (recording) => {
  return recording.url;
};

/**
 * Format recording data for display
 * @param {Object} recording - Recording object
 * @returns {Object} Formatted recording data
 */
export const formatRecordingData = (recording) => {
  return {
    filename: recording.filename,
    url: recording.url,
    startTime: new Date(recording.start_time),
    endTime: new Date(recording.end_time),
    duration: recording.end_time - recording.start_time,
  };
};
