import NavigationItem from "../NavItem/NavItem";
import { faBed, faHouse, faTaxi, faPlaneDeparture, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import headerBg from '../../assets/images/Header-BG.jpg';

function NavigationHeader() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="h-80 bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: `url(${headerBg})`}}> 
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Navigation Items */}
      <div className="absolute bottom-30 left-96 flex items-center gap-20 z-10">
        <NavigationItem icon={faBed} title="hotel"/>
        <NavigationItem icon={faHouse} title="villa"/>
        <NavigationItem icon={faTaxi} title="taxi"/>
        <NavigationItem icon={faPlaneDeparture} title="flights"/>
      </div>

      {/* User Profile Section */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        {currentUser ? (
          <div className="flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
            </div>
            <span className="text-white font-medium">{currentUser.name || currentUser.email}</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-white text-xs" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-white hover:text-blue-200 transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/signup" className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors font-medium">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default NavigationHeader