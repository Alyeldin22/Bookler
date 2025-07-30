const axios = require('axios');

async function testAPI() {
  console.log('🧪 Testing API endpoints...');
  
  try {
    const baseURL = 'http://localhost:3001';
    
    console.log('Testing /hotels...');
    const hotels = await axios.get(`${baseURL}/hotels`);
    console.log(`✅ Hotels: ${hotels.data.length} hotels found`);
    
    console.log('Testing /recommended_hotels...');
    const recommended = await axios.get(`${baseURL}/recommended_hotels`);
    console.log(`✅ Recommended: ${recommended.data.length} hotels found`);
    
    console.log('Testing /hotels/1...');
    const hotel = await axios.get(`${baseURL}/hotels/marriott_marquis_sf`);
    console.log(`✅ Hotel: ${hotel.data.name}`);
    
    console.log('🎉 All API tests passed!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI(); 