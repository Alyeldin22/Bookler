import { fetchAllData, apiService } from '../services/apiService';


export const runApiTests = async () => {
  console.log('🚀 Starting API Tests...');
  console.log('='.repeat(50));
  
  try {
  
    console.log('📊 Testing API Statistics...');
    const stats = await apiService.getApiStats();
    console.log('✅ API Stats:', stats);
    console.log('-'.repeat(30));
    

    console.log('🏨 Testing Hotels Endpoint...');
    const hotels = await apiService.getAllHotels();
    console.log(`✅ Found ${hotels.length} hotels`);
    console.log('Sample hotel:', hotels[0]);
    console.log('-'.repeat(30));
    

    console.log('⭐ Testing Recommended Hotels...');
    const recommended = await apiService.getRecommendedHotels();
    console.log(`✅ Found ${recommended.length} recommended hotels`);
    console.log('Sample recommended:', recommended[0]);
    console.log('-'.repeat(30));
    

    console.log('🎯 Testing Best Offers...');
    const offers = await apiService.getBestOffers();
    console.log(`✅ Found ${offers.length} best offers`);
    console.log('Sample offer:', offers[0]);
    console.log('-'.repeat(30));
    

    if (hotels.length > 0) {
      console.log('🏢 Testing Specific Hotel...');
      const firstHotelId = hotels[0].id;
      const hotelDetails = await apiService.getHotelById(firstHotelId);
      console.log(`✅ Hotel ${firstHotelId} details:`, hotelDetails.name);
      console.log('-'.repeat(30));
    }
    

    console.log('🔍 Testing All Endpoints...');
    const endpoints = await apiService.getAllEndpoints();
    console.log('✅ Endpoint test results:');
    Object.entries(endpoints).forEach(([name, result]) => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${name}: ${result.statusCode || result.error}`);
    });
    console.log('-'.repeat(30));
    

    console.log('🔄 Testing Fetch All Data...');
    const allData = await fetchAllData();
    console.log('✅ All data fetched successfully!');
    console.log(`📈 Summary: ${allData.hotels?.length || 0} hotels, ${allData.recommended?.length || 0} recommended, ${allData.offers?.length || 0} offers`);
    
    if (allData.errors.length > 0) {
      console.warn('⚠️ Errors encountered:', allData.errors);
    }
    
    console.log('='.repeat(50));
    console.log('🎉 All API tests completed successfully!');
    
    return allData;
    
  } catch (error) {
    console.error('❌ API Test failed:', error);
    throw error;
  }
};


if (typeof window !== 'undefined') {
  window.runApiTests = runApiTests;
  window.apiService = apiService;
  console.log('🔧 API Test utilities available:');
  console.log('- runApiTests() - Run all API tests');
  console.log('- apiService - Access individual API methods');
} 