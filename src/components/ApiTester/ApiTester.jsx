import { useState } from 'react';
import { Card, Button, Alert } from 'flowbite-react';
import { apiService, fetchAllData } from '../../services/apiService';

function ApiTester() {
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const runApiTests = async () => {
    setLoading(true);
    setErrors([]);
    try {
      const data = await fetchAllData();
      setApiData(data);
    } catch (error) {
      setErrors([{ endpoint: 'All', error: error.message }]);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="mb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 tracking-tight">API Tester</h1>
        <Button onClick={runApiTests} disabled={loading} className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
          {loading ? 'Testing...' : 'Run API Tests'}
        </Button>
        {apiData.endpoints && (
          <div className="mb-4">
            <h4 className="font-semibold text-orange-600 mb-2">Endpoint Test Results</h4>
            <div className="bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
              <pre className="text-xs">{JSON.stringify(apiData.endpoints, null, 2)}</pre>
            </div>
          </div>
        )}
        {errors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <h3 className="text-xl font-semibold mb-4 text-red-600">API Errors</h3>
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
        <Card className="bg-gray-50 mt-6">
          <h3 className="text-lg font-semibold mb-2">API Information</h3>
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
      </Card>
    </div>
  );
}
export default ApiTester; 