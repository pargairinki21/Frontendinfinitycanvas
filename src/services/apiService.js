import axios from 'axios';

const BASE_URL = 'http://3.111.171.144:8080';

export const executePrompt = async (query, cloudId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/prompt/execute`, {
      input: query,
      cloudId: cloudId
    });
    // Assuming the API response has a 'response' field that contains the actual data.
    // Adjust this based on the actual structure of your API's successful response.
    return response.data.response || [];
  } catch (error) {
    console.error('Query API failed:', error);
    throw error;
  }
};

export const getCatoidCategories = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/clouds`);
    return response.data.response || [];
  } catch (error) {
    console.error('Query API failed:', error);
    throw error;
  }
};