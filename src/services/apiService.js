import axios from 'axios';

// Backend URL - user's backend is running on http://127.0.0.1:8001
const POSSIBLE_URLS = [
  'http://127.0.0.1:8001',  // User's backend is here
  'http://127.0.0.1:8001/', // With trailing slash
  'http://localhost:8001',
  'http://localhost:8001/'
];

const BASE_URL = POSSIBLE_URLS[0]; // Default to http://127.0.0.1:8001

// Test function to check backend connectivity
export const testBackendConnection = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(`Testing backend connection at: ${url}`);
      const response = await axios.get(`${url}/`, { timeout: 5000 });
      console.log('Backend response:', response.data);
      return { ...response.data, url };
    } catch (error) {
      console.log(`Failed to connect to ${url}:`, error.message);
      continue;
    }
  }
  throw new Error('Cannot connect to backend on any of the common ports (8000, 8001). Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

export const executePrompt = async (query, cloudId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/prompt/execute`, {
      input: query,
      cloudId: cloudId
    });
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

// Camera API function
export const takePicture = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(`📸 Attempting to connect to camera API at: ${url}`);
      
      const response = await axios.post(`${url}/take_picture`, {}, {
        timeout: 15000, // 15 second timeout for camera operations
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📸 Camera API response:', response.data);
      
      // Handle your backend's response format
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message,
          filePath: response.data.file || null,
          timestamp: new Date().toISOString()
        };
      } else if (response.data && response.data.error) {
        // Handle error response from your backend
        throw new Error(response.data.error);
      } else if (response.data) {
        return {
          success: true,
          message: 'Picture taken successfully',
          filePath: response.data.file || null,
          data: response.data
        };
      }
      
      return {
        success: true,
        message: 'Picture taken successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        // If backend returns an error, throw it
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  
  throw new Error('Cannot connect to camera server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

// Volume Control API - Updated to match your backend
export const volumeUp = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(`🔊 Attempting to increase volume at: ${url}`);
      
      const response = await axios.post(`${url}/volume/up`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('🔊 Volume up response:', response.data);
      
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message
        };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      return {
        success: true,
        message: 'Volume increased successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

export const volumeDown = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(` Attempting to decrease volume at: ${url}`);
      
      const response = await axios.post(`${url}/volume/down`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(' Volume down response:', response.data);
      
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message
        };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      return {
        success: true,
        message: 'Volume decreased successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

export const volumeMute = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(` Attempting to mute volume at: ${url}`);
      
      const response = await axios.post(`${url}/volume/mute`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(' Volume mute response:', response.data);
      
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message
        };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      return {
        success: true,
        message: 'Volume muted successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

export const volumeUnmute = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(` Attempting to unmute volume at: ${url}`);
      
      const response = await axios.post(`${url}/volume/unmute`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(' Volume unmute response:', response.data);
      
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message
        };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      return {
        success: true,
        message: 'Volume unmuted successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

// Brightness Control API - Updated to match your backend
export const brightnessUp = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(` Attempting to increase brightness at: ${url}`);
      
      const response = await axios.post(`${url}/brightness/up`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(' Brightness up response:', response.data);
      
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message
        };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      return {
        success: true,
        message: 'Brightness increased successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  throw new Error('Cannot connect to brightness server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

export const brightnessDown = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(` Attempting to decrease brightness at: ${url}`);
      
      const response = await axios.post(`${url}/brightness/down`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(' Brightness down response:', response.data);
      
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message
        };
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      }
      
      return {
        success: true,
        message: 'Brightness decreased successfully',
        data: response.data
      };
    } catch (error) {
      console.log(` Failed to connect to ${url}:`, error.message);
      if (error.response && error.response.data) {
        console.log(' Error response:', error.response.data);
        if (error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      continue;
    }
  }
  throw new Error('Cannot connect to brightness server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

// Monitor/Screen Control API
export const toggleMonitor = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      const response = await axios.post(`${url}/monitor/toggle`);
      return response.data;
    } catch (error) {
      console.log(`Failed to connect to ${url}:`, error.message);
      continue;
    }
  }
  throw new Error('Cannot connect to monitor server. Please check if your FastAPI server is running on http://127.0.0.1:8001.');
};

// Function to save image locally (if we get image data from API)
export const saveImageLocally = async (imageData, filename = 'captured_image.jpg') => {
  try {
    const blob = new Blob([imageData], { type: 'image/jpeg' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Image saved locally' };
  } catch (error) {
    console.error('Failed to save image locally:', error);
    throw error;
  }
};