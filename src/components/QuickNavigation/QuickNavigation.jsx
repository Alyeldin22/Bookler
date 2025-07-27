import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faHeart, faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'flowbite-react';

function QuickNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/hotelssearch', icon: faSearch, label: 'Search' },
    { path: '/my-bookings', icon: faHeart, label: 'My Bookings' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const canGoBack = () => {
    return window.history.length > 1;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2">
        {/* Back button */}
        {canGoBack() && (
          <Button
            size="sm"
            color="gray"
            onClick={handleBack}
            className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            title="Go Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        )}

        {/* Quick navigation */}
        <div className="bg-white rounded-full shadow-lg p-2">
          <div className="flex flex-col gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                size="sm"
                color={isActive(item.path) ? "blue" : "gray"}
                onClick={() => navigate(item.path)}
                className={`rounded-full w-10 h-10 flex items-center justify-center transition-all ${
                  isActive(item.path) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={item.label}
              >
                <FontAwesomeIcon icon={item.icon} className="text-sm" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickNavigation; 