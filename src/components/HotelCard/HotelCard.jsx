import CustomButton from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Card } from 'flowbite-react';
import { useSelector } from 'react-redux';

function AccommodationCard({hotel}) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleBookNow = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate(`/book-hotel/${hotel.id}`);
    }
  };

  const handleViewMore = () => {
    // Navigate to hotel details page
    navigate(`/hotelssearch/${hotel.id}`);
  };

  // Safety checks for hotel data
  const hotelName = hotel?.name || 'Hotel Name';
  const hotelImage = hotel?.images?.main || hotel?.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';
  const hotelRating = hotel?.rating?.score || 'N/A';
  const hotelStreet = hotel?.address?.street || 'Address';
  const hotelCity = hotel?.address?.city || 'City';
  const hotelAmenities = Array.isArray(hotel?.amenities) ? hotel.amenities : [];
  const hotelPricing = hotel?.pricing?.[0] || {};
  const originalPrice = hotelPricing.originalPrice || 'N/A';
  const discountedPrice = hotelPricing.discountedPrice || 'N/A';
  const discount = hotelPricing.discount || 'N/A';

  return (
    <div className="col-span-12 lg:col-span-6 flex">
      <Card className="flex justify-between items-stretch w-full hover:shadow-lg transition-shadow cursor-pointer">
        <div className="hotel-img w-2/5">
          <img 
            src={hotelImage} 
            alt={hotelName}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
        
        <div className="hotel-details w-3/5 p-3 relative">
          <div className="rate flex items-center absolute right-0 top-8 bg-blue-600 text-white px-3 py-1 rounded-l-md text-sm">
            {hotelRating}
            <FontAwesomeIcon icon={faStar} className="ml-1 text-xs"/>
          </div>
          
          <h3 className="text-lg font-bold w-4/5 mt-8">{hotelName}</h3>
          <p className="location text-sm text-gray-500 mt-1">
            {hotelStreet}, {hotelCity}
          </p>
          
          <div className="amenities flex gap-2 flex-wrap my-2">
            {hotelAmenities.slice(0, 3).map((am, index) => (
              <span key={index} className="bg-blue-100 px-2 py-1 text-xs rounded-md">
                {am}
              </span>
            ))}
            {hotelAmenities.length > 3 && (
              <span className="bg-gray-100 px-2 py-1 text-xs rounded-md text-gray-600">
                +{hotelAmenities.length - 3} more
              </span>
            )}
            {hotelAmenities.length === 0 && (
              <span className="bg-gray-100 px-2 py-1 text-xs rounded-md text-gray-600">
                No amenities listed
              </span>
            )}
          </div>
          
          <div className="price-buttons flex items-center justify-between mt-3">
            <div className="price flex gap-2 items-center">
              <p className="discount text-yellow-500 text-xs">{discount}</p>
              <p className="actual-price font-bold text-sm">${discountedPrice}</p>
            </div>
            
            <div className="buttons flex gap-2">
              <button
                onClick={handleViewMore}
                className="view px-3 py-1 text-xs text-black bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              >
                view more
              </button>
              <CustomButton 
                onClick={handleBookNow}
                title="book now" 
                className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700" 
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AccommodationCard