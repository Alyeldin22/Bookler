import CustomButton from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { Card } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function FeaturedAccommodationCard({hotel}) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleBookNow = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate(`/book-hotel/${hotel.id}`);
    }
  };

  const handleCardClick = () => {
    navigate(`/hotelssearch/${hotel.id}`);
  };

  // Safety checks for hotel data
  const hotelName = hotel?.name || 'Hotel Name';
  const hotelImage = hotel?.images?.main || hotel?.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';
  const hotelRating = hotel?.rating?.score || 0;
  const hotelStreet = hotel?.address?.street || 'Address';
  const hotelCountry = hotel?.address?.country || 'Country';
  const hotelPricing = hotel?.pricing?.[0] || {};
  const originalPrice = hotelPricing.originalPrice || 'N/A';
  const discountedPrice = hotelPricing.discountedPrice || 'N/A';
  const discount = hotelPricing.discount || 'N/A';

  // Generate star rating display
  const renderStars = () => {
    const fullStars = Math.floor(hotelRating);
    const hasHalfStar = hotelRating - fullStars !== 0;
    
    return (
      <div className="filled-stars flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="text-sm"/>
        ))}
        {hasHalfStar && (
          <FontAwesomeIcon icon={faStarHalf} className="text-yellow-400 text-sm"/>
        )}
      </div>
    );
  };

  return (
    <Card 
      className="flex justify-between items-center gap-4 mt-5 rounded-3xl capitalize hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="rec-img w-2/5 h-44">
        <img 
          src={hotelImage} 
          alt={hotelName}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>
      
      <div className="rec-details w-4/5">
        <h5 className="text-gray-400 text-sm">hotel</h5>
        <h2 className="text-2xl font-bold mt-1">{hotelName}</h2>
        <p className="text-gray-500 mt-1">{hotelStreet}, {hotelCountry}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="rating flex items-center">
            {renderStars()}
            <span className="ml-1 text-sm text-gray-600">({hotelRating})</span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <CustomButton 
              onClick={handleBookNow}
              className="px-3 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100" 
              title="book now" 
            />
          </div>
        </div>

        {/* Price information */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
          <span className="text-lg font-bold text-blue-600">${discountedPrice}</span>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{discount}</span>
        </div>
      </div>
    </Card>
  )
}

export default FeaturedAccommodationCard