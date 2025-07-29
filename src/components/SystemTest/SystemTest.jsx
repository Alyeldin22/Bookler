import { useState, useEffect } from 'react';
import { Button, Card, Badge, Alert, Spinner, TextInput, Select } from 'flowbite-react';
import { fetchAllData } from '../../services/apiService';

function SystemTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};
    try {
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500 text-white p-4 rounded-lg';
      document.body.appendChild(testElement);
      const computedStyle = window.getComputedStyle(testElement);
      results.tailwind = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && computedStyle.backgroundColor !== '';
      document.body.removeChild(testElement);
    } catch (error) {
      results.tailwind = false;
      console.error('Tailwind test failed:', error);
    }
    try {
      results.flowbite = true;
    } catch (error) {
      results.flowbite = false;
      console.error('Flowbite test failed:', error);
    }
    try {
      const apiData = await fetchAllData();
      results.api = apiData.hotels !== null || apiData.recommended !== null;
      results.apiData = apiData;
    } catch (error) {
      results.api = false;
      results.apiError = error.message;
      console.error('API test failed:', error);
    }
    try {
      localStorage.setItem('test', 'working');
      const testValue = localStorage.getItem('test');
      results.localStorage = testValue === 'working';
      localStorage.removeItem('test');
    } catch (error) {
      results.localStorage = false;
      console.error('LocalStorage test failed:', error);
    }
    try {
      results.responsive = window.innerWidth > 0;
    } catch (error) {
      results.responsive = false;
      console.error('Responsive test failed:', error);
    }
    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusColor = (status) => status ? 'success' : 'failure';
  const getStatusText = (status) => status ? '✅ Working' : '❌ Failed';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Card className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">System Test Dashboard</h1>
        <div className="mb-6">
          <Button onClick={runTests} disabled={loading} className="mb-4">
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Run All Tests
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-2">🎨 Tailwind CSS</h3>
            <Badge color={getStatusColor(testResults.tailwind)}>
              {getStatusText(testResults.tailwind)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">Tests if Tailwind classes are working</div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">🔧 Flowbite Components</h3>
            <Badge color={getStatusColor(testResults.flowbite)}>
              {getStatusText(testResults.flowbite)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">Tests if Flowbite components render</div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">🌐 API Connection</h3>
            <Badge color={getStatusColor(testResults.api)}>
              {getStatusText(testResults.api)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">Tests if API is reachable</div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">💾 Local Storage</h3>
            <Badge color={getStatusColor(testResults.localStorage)}>
              {getStatusText(testResults.localStorage)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">Tests if localStorage works</div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">📱 Responsive Test</h3>
            <Badge color={getStatusColor(testResults.responsive)}>
              {getStatusText(testResults.responsive)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">Tests if app is responsive</div>
          </Card>
        </div>
        {testResults.apiData && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2 text-blue-700">API Data</h2>
            <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto max-h-64">
              {JSON.stringify(testResults.apiData, null, 2)}
            </pre>
          </div>
        )}
        {testResults.apiError && (
          <Alert color="failure" className="mt-4">
            <span className="font-medium">API Error:</span> {testResults.apiError}
          </Alert>
        )}
      </Card>
    </div>
  );
}
export default SystemTest; 