import axios from 'axios';

// Backend URL - Live deployment
const FORM_API_URLS = [
  'https://infinitycanvasmainbackend.onrender.com',
  'http://127.0.0.1:8001', // Fallback for local development
  'http://localhost:8001',
];
const PERIPHERAL_API_URLS = [
  'https://infinitycanvasmainbackend.onrender.com', // Use same backend for peripheral APIs
  'http://127.0.0.1:8002', // Fallback for local development
  'http://localhost:8002',
];
 // Default to http://127.0.0.1:8002

// Test function to check backend connectivity
export const testBackendConnection = async () => {
  for (const url of FORM_API_URLS) {
    try {
      console.log(`Testing backend connection at: ${url}`);
      const response = await axios.get(`${url}/`, { timeout: 5000 });
      console.log('Backend response:', response.data);
      return { ...response.data, url };
    } catch (error) {
      console.error(`Connection failed to ${url}:`, error.message);
    }
  }
  throw new Error('No backend servers are accessible');
};

// Test chat endpoint specifically
export const testChatEndpoint = async (testMessage = "hdfc form") => {
  console.log('🧪 Testing /chat endpoint with:', testMessage);
  try {
    const response = await axios.post(`${FORM_API_URLS}/chat`, {
      message: testMessage
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('🧪 Chat test response:', response.data);
    return response.data;
  } catch (error) {
    console.error('🧪 Chat test failed:', error);
    console.error('🧪 Error details:', error.response?.data);
    console.error('🧪 Error status:', error.response?.status);
    throw error;
  }
};

// Add test function to window for debugging
if (typeof window !== 'undefined') {
  window.testAPI = testChatEndpoint;
  window.testConnection = testBackendConnection;
}

export const executePrompt = async (query, cloudId) => {
  try {
    const response = await axios.post(`${FORM_API_URLS[0]}/api/prompt/execute`, {
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
    const response = await axios.get(`${FORM_API_URLS[0]}/admin/clouds`);
    return response.data.response || [];
  } catch (error) {
    console.error('Query API failed:', error);
    throw error;
  }
};

// Camera API function
export const takePicture = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  
  throw new Error('Cannot connect to camera server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

// Volume Control API - Updated to match your backend
export const volumeUp = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

export const volumeDown = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

export const volumeMute = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

export const volumeUnmute = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  throw new Error('Cannot connect to volume server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

// Brightness Control API - Updated to match your backend
export const brightnessUp = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  throw new Error('Cannot connect to brightness server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

export const brightnessDown = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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
  throw new Error('Cannot connect to brightness server. Please check if your FastAPI server is running on http://127.0.0.1:8002.');
};

// Monitor/Screen Control API
export const toggleMonitor = async () => {
  for (const url of PERIPHERAL_API_URLS) {
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

// Enhanced Form Search API - using the /forms/search endpoint
export const searchForms = async (query) => {
  try {
    console.log(`🔍 Searching forms with query: "${query}"`);
    
    const response = await axios.get(`${FORM_API_URLS[0]}/forms/search?query=${encodeURIComponent(query)}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('🔍 Form search response:', response.data);
    
    if (response.data && response.data.forms && response.data.forms.length > 0) {
      const firstForm = response.data.forms[0];
      return {
        success: true,
        pdf_url: firstForm.url,
        message: `Form found: ${firstForm.name}`,
        form_name: firstForm.name,
        filename: firstForm.filename,
        total_found: response.data.total
      };
    } else {
      return {
        success: false,
        error: 'No forms found matching your query'
      };
    }
  } catch (error) {
    console.error('Form search API failed:', error);
    if (error.response && error.response.data) {
      return {
        success: false,
        error: error.response.data.error || 'Form search failed'
      };
    }
    return {
      success: false,
      error: 'Form search failed'
    };
  }
};

// Voice Query API - for voice-to-text form search (keeping for backward compatibility)
export const queryVoiceText = async (text) => {
  // Use the enhanced form search instead
  return await searchForms(text);
};

// Process text for voice-to-form functionality using /chat endpoint
export const processAudio = async (textInput) => {
  console.log('🎤 Processing text input:', textInput);

  for (const url of FORM_API_URLS) {
    try {
      console.log(`🔗 Calling: ${url}/chat`);
      const response = await axios.post(`${url}/chat`, { message: textInput }, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });

      const data = response.data;
      console.log('📥 Backend response:', data);

      // Check for peripheral result first
      if (data.peripheral_result) {
        console.log('⚡ Peripheral API called:', data.peripheral_result);
      } else {
        console.log('❌ No peripheral_result in response');
      }

      // Log peripheral field specifically
      if (data.peripheral) {
        console.log('🎛️ Peripheral field:', data.peripheral);
      }

      // Check for forms/pdf
      let pdf_url = null;
      if (data.pdf_path) pdf_url = data.pdf_path;
      else if (data.forms && data.forms.length > 0) pdf_url = data.forms[0].url;

      return {
        success: true,
        message: data.message || 'Response received',
        pdf_url,
        peripheral_result: data.peripheral_result || null,
        full_response: data // Include full response for debugging
      };

    } catch (error) {
      console.error(`❌ Error with ${url}/chat:`, error.message);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
      }
      continue;
    }
  }

  return { success: false, message: 'Could not connect to any backend server' };
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