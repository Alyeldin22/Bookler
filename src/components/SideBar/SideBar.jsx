import logo from "../../assets/images/Brand-Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faAddressBook, faEarthEurope, faCircleQuestion, faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../store/UserSlice';
import "./SideBar.css";
import { useState } from 'react';

function SideNavigation({ onShrinkChange }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [shrink, setShrink] = useState(false);

  const handleLogout = () => {
    dispatch(logOut());
  };

  const handleToggleShrink = () => {
    setShrink((prev) => {
      const newShrink = !prev;
      if (onShrinkChange) onShrinkChange(newShrink);
      return newShrink;
    });
  };

  return (
    <aside className={`sidebar-custom aside ${shrink ? 'shrink' : ''} w-48 p-5 bg-blue-600 text-white absolute top-12 left-10 rounded-md shadow-lg`}>
      <div className="flex justify-between items-center mb-12">
        <div className="logo">
          <img src={logo} alt="logo" className="h-7 w-20 text-center"/>
        </div>
        <div className="icon cursor-pointer hover:scale-110 transition-transform" onClick={handleToggleShrink} style={{ width: '63.5px', height: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={faBars} style={{ width: '63.5px', height: '17px' }}/>
        </div>
      </div>
      <div className={`flex flex-col gap-4`}>
        <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
          <FontAwesomeIcon icon={faHome} className="mr-3"/>
          {!shrink && <>home</>}
        </NavLink>
        {currentUser ? (
          <>
            <NavLink to="/my-bookings" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faAddressBook} className="mr-3"/>
              {!shrink && <>my bookings</>}
            </NavLink>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faEarthEurope} className="mr-3"/>
              {!shrink && <>explore</>}
            </NavLink>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="mr-3"/>
              {!shrink && <>support</>}
            </NavLink>
            <button 
              onClick={handleLogout}
              className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center w-full text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3"/>
              {!shrink && <>logout</>}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faEarthEurope} className="mr-3"/>
              {!shrink && <>explore</>}
            </NavLink>
            <NavLink to="/" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="mr-3"/>
              {!shrink && <>support</>}
            </NavLink>
            <NavLink to="/login" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-3"/>
              {!shrink && <>sign in</>}
            </NavLink>
            <NavLink to="/signup" className="text-white capitalize mb-5 hover:text-blue-200 transition-colors flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-3"/>
              {!shrink && <>sign up</>}
            </NavLink>
          </>
        )}
      </div>
      <div className={`bg-contain bg-no-repeat h-24 mt-24 ${shrink ? 'hidden' : ''}`} style={{backgroundImage: 'url(../../assets/images/cloud.png)'}}>
      </div>
    </aside>
  )
}

export default SideNavigation;