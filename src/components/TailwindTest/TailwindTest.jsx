import { Button, Card, Badge, Alert } from 'flowbite-react';

function TailwindTest() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">🧪 Tailwind & Flowbite Test</h1>
        
        <div className="space-y-6">
          {/* Tailwind Classes Test */}
          <div>
            <h2 className="text-xl font-semibold mb-3">🎨 Tailwind CSS Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
                Blue Box
              </div>
              <div className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
                Green Box
              </div>
              <div className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-colors">
                Red Box
              </div>
            </div>
          </div>

          {/* Flowbite Components Test */}
          <div>
            <h2 className="text-xl font-semibold mb-3">🔧 Flowbite Components</h2>
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Button color="blue">Blue Button</Button>
                <Button color="green">Green Button</Button>
                <Button color="red">Red Button</Button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge color="info">Info Badge</Badge>
                <Badge color="success">Success Badge</Badge>
                <Badge color="warning">Warning Badge</Badge>
                <Badge color="failure">Error Badge</Badge>
              </div>
              
              <Alert color="info">
                <span className="font-medium">Info alert!</span> This is a Flowbite alert component.
              </Alert>
            </div>
          </div>

          {/* Responsive Design Test */}
          <div>
            <h2 className="text-xl font-semibold mb-3">📱 Responsive Design</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm md:text-base lg:text-lg">
                This text should be different sizes on different screen sizes.
              </p>
              <div className="mt-2 text-xs text-gray-600">
                <p>Mobile: Small text</p>
                <p className="hidden md:block">Desktop: Normal text</p>
                <p className="hidden lg:block">Large: Big text</p>
              </div>
            </div>
          </div>

          {/* Custom Classes Test */}
          <div>
            <h2 className="text-xl font-semibold mb-3">🎯 Custom Utilities</h2>
            <div className="bg-gray-200 p-4 rounded-lg overflow-x-auto scrollbar-hide">
              <p>This container has custom scrollbar-hide utility class applied.</p>
              <p>If you see a scrollbar, the custom utility is not working.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TailwindTest; 