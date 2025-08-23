// Quick test script to debug the backend issue
const axios = require('axios');

async function testPeripheralAPI() {
  try {
    console.log('Testing port 8002 directly...');
    const response = await axios.post('http://127.0.0.1:8002/volume/up');
    console.log('✅ Port 8002 response:', response.data);
  } catch (error) {
    console.log('❌ Port 8002 error:', error.message);
  }
}

async function testFormAPI() {
  try {
    console.log('Testing port 8001 chat endpoint...');
    const response = await axios.post('http://127.0.0.1:8001/chat', {
      message: 'increase volume'
    });
    console.log('✅ Port 8001 response:', response.data);
    console.log('🎛️ Peripheral field:', response.data.peripheral);
    console.log('⚡ Peripheral result:', response.data.peripheral_result);
  } catch (error) {
    console.log('❌ Port 8001 error:', error.message);
  }
}

// Run tests
testPeripheralAPI();
testFormAPI();
