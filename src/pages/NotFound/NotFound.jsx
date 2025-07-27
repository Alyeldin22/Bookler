import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import notFound from '../../assets/images/not-found.png';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="text-center p-8 max-w-md">
        <img 
          src={notFound} 
          alt="Page not found" 
          className="w-64 h-64 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Go Back Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}

export default NotFound; 