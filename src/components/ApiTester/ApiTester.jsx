import { useState, useEffect } from 'react';
import { fetchAllData, apiService } from '../../services/apiService';
import { Card, Button, Badge, Spinner } from 'flowbite-react';

function ApiTester() {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState(null);

  const handleFetchAll = async () => {
    setLoading(true);
    setErrors([]);
    try {
      const results = await fetchAllData();
      setApiData(results);
      setStats(results.stats);
      setErrors(results.errors);
    } catch (error) {
      setErrors([{ endpoint: 'general', error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEndpoints = async () => {
    setLoading(true);
    try {
      const endpoints = await apiService.getAllEndpoints();
      console.log('🔍 All Endpoints Test Results:', endpoints);
      setApiData({ endpoints });
    } catch (error) {
      setErrors([{ endpoint: 'endpoints', error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStats = async () => {
    setLoading(true);
    try {
      const apiStats = await apiService.getApiStats();
      setStats(apiStats);
      console.log('📊 API Statistics:', apiStats);
    } catch (error) {
      setErrors([{ endpoint: 'stats', error: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">🔌 API Testing Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Test all available endpoints and view API statistics for the Booking App.
        </p>
        
        <div className="flex gap-4 flex-wrap">
          <Button 
            onClick={handleFetchAll} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Fetch All Data
          </Button>
          
          <Button 
            onClick={handleTestEndpoints} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            Test All Endpoints
          </Button>
          
          <Button 
            onClick={handleGetStats} 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Get API Stats
          </Button>
        </div>
      </Card>

      {/* API Statistics */}
      {stats && (
        <Card className="mb-6">
          <h3 className="text-xl font-semibold mb-4">📊 API Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalHotels}</div>
              <div className="text-sm text-gray-600">Total Hotels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalRecommended}</div>
              <div className="text-sm text-gray-600">Recommended</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalOffers}</div>
              <div className="text-sm text-gray-600">Best Offers</div>
            </div>
            <div className="text-center">
              <Badge color={stats.apiStatus === 'online' ? 'success' : 'failure'}>
                {stats.apiStatus}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">API Status</div>
            </div>
          </div>
        </Card>
      )}

      {/* API Data Results */}
      {apiData && (
        <Card className="mb-6">
          <h3 className="text-xl font-semibold mb-4">📋 API Data Results</h3>
          
          {apiData.hotels && (
            <div className="mb-4">
              <h4 className="font-semibold text-green-600 mb-2">🏨 Hotels ({apiData.hotels.length})</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <pre className="text-xs">{JSON.stringify(apiData.hotels.slice(0, 2), null, 2)}</pre>
                {apiData.hotels.length > 2 && (
                  <p className="text-xs text-gray-500 mt-2">... and {apiData.hotels.length - 2} more hotels</p>
                )}
              </div>
            </div>
          )}

          {apiData.recommended && (
            <div className="mb-4">
              <h4 className="font-semibold text-blue-600 mb-2">⭐ Recommended Hotels ({apiData.recommended.length})</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <pre className="text-xs">{JSON.stringify(apiData.recommended.slice(0, 2), null, 2)}</pre>
                {apiData.recommended.length > 2 && (
                  <p className="text-xs text-gray-500 mt-2">... and {apiData.recommended.length - 2} more</p>
                )}
              </div>
            </div>
          )}

          {apiData.offers && (
            <div className="mb-4">
              <h4 className="font-semibold text-purple-600 mb-2">🎯 Best Offers ({apiData.offers.length})</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <pre className="text-xs">{JSON.stringify(apiData.offers, null, 2)}</pre>
              </div>
            </div>
          )}

          {apiData.endpoints && (
            <div className="mb-4">
              <h4 className="font-semibold text-orange-600 mb-2">🔍 Endpoint Test Results</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                <pre className="text-xs">{JSON.stringify(apiData.endpoints, null, 2)}</pre>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <h3 className="text-xl font-semibold mb-4 text-red-600">❌ API Errors</h3>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="bg-red-100 p-3 rounded-lg">
                <div className="font-semibold text-red-800">{error.endpoint}</div>
                <div className="text-red-600 text-sm">{error.error}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* API Base URL Info */}
      <Card className="bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">🔗 API Information</h3>
        <div className="text-sm text-gray-600">
          <p><strong>Base URL:</strong> https://booking-app-db.vercel.app</p>
          <p><strong>Available Endpoints:</strong></p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><code className="bg-gray-200 px-1 rounded">GET /hotels</code> - Get all hotels</li>
            <li><code className="bg-gray-200 px-1 rounded">GET /hotels/:id</code> - Get hotel by ID</li>
            <li><code className="bg-gray-200 px-1 rounded">GET /recommended_hotels</code> - Get recommended hotels</li>
            <li><code className="bg-gray-200 px-1 rounded">GET /best_offer</code> - Get best offers</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default ApiTester; 