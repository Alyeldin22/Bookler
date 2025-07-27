import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NavigationItem({icon, title}) {
  return (
    <div className="flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform">
      <FontAwesomeIcon icon={icon} className="text-white text-2xl mb-2"/>
      <p className="text-white text-sm uppercase font-medium">{title}</p>
    </div>
  )
}

export default NavigationItem