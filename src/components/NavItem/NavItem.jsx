import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

function NavigationItem({icon, title}) {
  const routeMap = {
    hotel: '/hotelssearch',
    villa: '/hotelssearch',
    taxi: '/',
    flights: '/',
  };
  const route = routeMap[title.toLowerCase()] || '/';
  return (
    <NavLink to={route} className="flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform mt-20">
      <FontAwesomeIcon icon={icon} className="text-white text-2xl mb-2"/>
      <p className="text-white text-sm uppercase font-medium">{title}</p>
    </NavLink>
  )
}

export default NavigationItem