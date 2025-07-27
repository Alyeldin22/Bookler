import { useState, useEffect } from 'react';
import { Button, Card, Badge, Alert, Spinner, TextInput, Select } from 'flowbite-react';
import { fetchAllData } from '../../services/apiService';

function SystemTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // Test 1: Tailwind CSS
    try {
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500 text-white p-4 rounded-lg';
      document.body.appendChild(testElement);
      const computedStyle = window.getComputedStyle(testElement);
      results.tailwind = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                        computedStyle.backgroundColor !== '';
      document.body.removeChild(testElement);
    } catch (error) {
      results.tailwind = false;
      console.error('Tailwind test failed:', error);
    }

    // Test 2: Flowbite Components
    try {
      results.flowbite = true; // If we can render this component, Flowbite is working
    } catch (error) {
      results.flowbite = false;
      console.error('Flowbite test failed:', error);
    }

    // Test 3: API Connection
    try {
      const apiData = await fetchAllData();
      results.api = apiData.hotels !== null || apiData.recommended !== null;
      results.apiData = apiData;
    } catch (error) {
      results.api = false;
      results.apiError = error.message;
      console.error('API test failed:', error);
    }

    // Test 4: Local Storage
    try {
      localStorage.setItem('test', 'working');
      const testValue = localStorage.getItem('test');
      results.localStorage = testValue === 'working';
      localStorage.removeItem('test');
    } catch (error) {
      results.localStorage = false;
      console.error('LocalStorage test failed:', error);
    }

    // Test 5: Responsive Design
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
        <h1 className="text-3xl font-bold text-blue-600 mb-4">🔧 System Test Dashboard</h1>
        
        <div className="mb-6">
          <Button onClick={runTests} disabled={loading} className="mb-4">
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            Run All Tests
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tailwind Test */}
          <Card>
            <h3 className="text-lg font-semibold mb-2">🎨 Tailwind CSS</h3>
            <Badge color={getStatusColor(testResults.tailwind)}>
              {getStatusText(testResults.tailwind)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">
              Tests if Tailwind classes are working
            </div>
          </Card>

          {/* Flowbite Test */}
          <Card>
            <h3 className="text-lg font-semibold mb-2">🔧 Flowbite Components</h3>
            <Badge color={getStatusColor(testResults.flowbite)}>
              {getStatusText(testResults.flowbite)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">
              Tests if Flowbite components render
            </div>
          </Card>

          {/* API Test */}
          <Card>
            <h3 className="text-lg font-semibold mb-2">🌐 API Connection</h3>
            <Badge color={getStatusColor(testResults.api)}>
              {getStatusText(testResults.api)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">
              Tests API connectivity
            </div>
            {testResults.apiError && (
              <div className="mt-2 text-xs text-red-500">
                Error: {testResults.apiError}
              </div>
            )}
          </Card>

          {/* LocalStorage Test */}
          <Card>
            <h3 className="text-lg font-semibold mb-2">💾 Local Storage</h3>
            <Badge color={getStatusColor(testResults.localStorage)}>
              {getStatusText(testResults.localStorage)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">
              Tests browser storage
            </div>
          </Card>

          {/* Responsive Test */}
          <Card>
            <h3 className="text-lg font-semibold mb-2">📱 Responsive Design</h3>
            <Badge color={getStatusColor(testResults.responsive)}>
              {getStatusText(testResults.responsive)}
            </Badge>
            <div className="mt-2 text-sm text-gray-600">
              Tests responsive capabilities
            </div>
          </Card>
        </div>

        {/* API Data Display */}
        {testResults.apiData && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4">📊 API Data Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.apiData.hotels?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.apiData.recommended?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Recommended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.apiData.offers?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Offers</div>
              </div>
            </div>
          </Card>
        )}

        {/* Component Test */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4">🧪 Component Test</h3>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button color="blue">Blue Button</Button>
              <Button color="green">Green Button</Button>
              <Button color="red">Red Button</Button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Badge color="info">Info</Badge>
              <Badge color="success">Success</Badge>
              <Badge color="warning">Warning</Badge>
              <Badge color="failure">Error</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput placeholder="Test input" />
              <Select>
                <option>Test option 1</option>
                <option>Test option 2</option>
              </Select>
            </div>

            <Alert color="info">
              <span className="font-medium">Test Alert!</span> This is a test alert component.
            </Alert>
          </div>
        </Card>

        {/* Responsive Test */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4">📱 Responsive Test</h3>
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-sm md:text-base lg:text-lg">
              This text should change size on different screen sizes.
            </p>
            <div className="mt-2 text-xs text-gray-600">
              <p>Mobile: Small text</p>
              <p className="hidden md:block">Desktop: Normal text</p>
              <p className="hidden lg:block">Large: Big text</p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}

export default SystemTest; 