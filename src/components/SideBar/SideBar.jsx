import logo from "../../assets/images/Brand-Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faAddressBook, faEarthEurope, faCircleQuestion, faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../store/UserSlice';

function SideNavigation() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <aside className="w-48 p-5 bg-blue-600 text-white absolute top-12 left-10 rounded-md shadow-lg">
      <div className="flex justify-between items-center mb-12">
        <div className="logo">
          <img src={logo} alt="logo" className="h-8"/>
        </div>
        <div className="icon cursor-pointer hover:scale-110 transition-transform">
          <FontAwesomeIcon icon={faBars}/>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
          <FontAwesomeIcon icon={faHome} className="mr-3"/> home
        </NavLink>
        
        {currentUser ? (
          <>
            <NavLink to="/my-bookings" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faAddressBook} className="mr-3"/> my bookings
            </NavLink>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faEarthEurope} className="mr-3"/> explore
            </NavLink>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="mr-3"/> support
            </NavLink>
            <button 
              onClick={handleLogout}
              className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center w-full text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3"/> logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faEarthEurope} className="mr-3"/> explore
            </NavLink>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="mr-3"/> support
            </NavLink>
            <NavLink to="/login" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/> sign in
            </NavLink>
            <NavLink to="/signup" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-3"/> sign up
            </NavLink>
          </>
        )}
      </div>
      
      <div className="bg-contain bg-no-repeat h-24 mt-24" style={{backgroundImage: 'url(../../assets/images/cloud.png)'}}>
      </div>
    </aside>
  )
}

export default SideNavigation