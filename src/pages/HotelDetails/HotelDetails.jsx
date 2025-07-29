import { useEffect, useState, useRef } from "react";
import FeaturedAccommodationCard from "../../components/RecommendedCard/RecommendedCard";
import { ApiUrl } from "../../network/interceptor/ApiUrl";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faLocationDot, faWifi, faParking, faUtensils, faDumbbell, faSwimmingPool, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import NavigationHeader from "../../components/Header/Header";
import SideNavigation from "../../components/SideBar/SideBar";
import SearchForm from "../../components/SearchInput/SearchInput";
import { Card, Button, Spinner } from 'flowbite-react';
import CustomButton from "../../components/Button/Button";
import { useSelector } from 'react-redux';

function HotelDetailsPage() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [recommendedHotels, setRecommendedHotels] = useState(null);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  //fetch recommended hotels data
  useEffect(()=>{
    setRecommendedLoading(true);
    ApiUrl.get("/recommended_hotels")
    .then((res)=>{
      // Filter out the current hotel from recommendations
      const filteredHotels = res.data.filter(h => h.id !== parseInt(id));
      setRecommendedHotels(filteredHotels);
      console.log("Recommended hotels:", filteredHotels);
    })
    .catch((err) => {
      console.error("Error loading recommended hotels:", err);
    })
    .finally(() => {
      setRecommendedLoading(false);
    });
  },[id])

  const nextSlide = () => {
    if (hotel && hotel.images && Array.isArray(hotel.images)) {
      setCurrentIndex((prevIndex) =>
        prevIndex === hotel.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (hotel && hotel.images && Array.isArray(hotel.images)) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? hotel.images.length - 1 : prevIndex - 1
      );
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400; // Adjust based on card width
      const currentScroll = carouselRef.current.scrollLeft;
      
      if (direction === 'left') {
        carouselRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        carouselRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const canScrollLeft = () => {
    return carouselRef.current && carouselRef.current.scrollLeft > 0;
  };

  const canScrollRight = () => {
    if (!carouselRef.current) return false;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    return scrollLeft < scrollWidth - clientWidth - 10; // 10px buffer
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    ApiUrl.get(`/hotels/${id}`)
    .then((res) => {
      setHotel(res.data);
      console.log("Hotel details:", res.data);
    })
    .catch((err) => {
      console.error("Error loading hotel details:", err);
      setError("Failed to load hotel details. Please try again later.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

  const { currentUser } = useSelector((state) => state.user);

  const handleBookNow = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      navigate(`/book-hotel/${hotel.id}`);
    }
  };

  // Helper function to get hotel images safely
  const getHotelImages = () => {
    if (!hotel) return [];
    if (Array.isArray(hotel.images)) return hotel.images;
    if (hotel.images && hotel.images.main) return [hotel.images.main];
    return [];
  };

  // Helper function to get current image
  const getCurrentImage = () => {
    const images = getHotelImages();
    if (images.length === 0) return null;
    return images[currentIndex] || images[0];
  };

  if (loading) {
    return (
      <>
        <NavigationHeader />
        <SideNavigation />
        <div className="w-[calc(100vw-320px)] ml-72 p-6 flex items-center justify-center">
          <div className="text-center">
            <Spinner size="xl" />
            <p className="mt-4">Loading hotel details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !hotel) {
    return (
      <>
        <NavigationHeader />
        <SideNavigation />
        <div className="w-[calc(100vw-320px)] ml-72 p-6">
          <Card className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Hotel not found</h2>
            <p className="text-gray-600 mt-2">The hotel you're looking for doesn't exist.</p>
            <Link to="/hotelssearch">
              <Button className="mt-4">Back to Hotels</Button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  const hotelImages = getHotelImages();
  const currentImage = getCurrentImage();

  return (
    <>
      <NavigationHeader />
      <SideNavigation />

      <section className="hotel-details w-full max-w-full md:w-[calc(100vw-320px)] md:ml-72 px-2 md:px-0">
        <SearchForm />
        
        {!loading && !error && hotel && (
          <Card className="hotel-details-container flex flex-col md:flex-row items-stretch justify-between mt-5 p-2 md:p-5">
            <div className="hotel-carousel w-full md:w-1/2 h-64 md:h-96 mb-4 md:mb-0">
              <div className="relative h-full">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${hotel.name} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                
                {hotelImages.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {hotelImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="hotel-info w-full md:w-1/2 p-2 md:p-4">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{hotel.name || 'Hotel Name'}</h1>
                <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md">
                  <span className="mr-1">{hotel.rating?.score || 'N/A'}</span>
                  <FontAwesomeIcon icon={faStar} className="text-sm"/>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2"/>
                <span>
                  {hotel.address?.street || 'Address'}, {hotel.address?.city || 'City'}, {hotel.address?.country || 'Country'}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {hotel.description || "Experience luxury and comfort at this exceptional hotel. Perfect for both business and leisure travelers."}
              </p>

              <div className="amenities mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 ? (
                    hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <FontAwesomeIcon 
                          icon={
                            amenity.toLowerCase().includes('wifi') ? faWifi :
                            amenity.toLowerCase().includes('parking') ? faParking :
                            amenity.toLowerCase().includes('restaurant') ? faUtensils :
                            amenity.toLowerCase().includes('gym') ? faDumbbell :
                            amenity.toLowerCase().includes('pool') ? faSwimmingPool :
                            faStar
                          } 
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm col-span-2">No amenities listed</p>
                  )}
                </div>
              </div>

              <div className="pricing mb-6">
                <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 line-through">
                        ${hotel.pricing?.[0]?.originalPrice || 'N/A'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${hotel.pricing?.[0]?.discountedPrice || 'N/A'}
                      </p>
                      <p className="text-sm text-green-600">
                        {hotel.pricing?.[0]?.discount || 'N/A'} off
                      </p>
                    </div>
                    <Button 
                      onClick={handleBookNow}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <section className="recommended-hotels w-full mx-auto mt-12 relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="capitalize font-bold text-2xl">You might also like</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="gray"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft()}
                className="rounded-full w-10 h-10 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              <Button
                size="sm"
                color="gray"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight()}
                className="rounded-full w-10 h-10 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          </div>
          
          {recommendedLoading && (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
              <span className="ml-3">Loading recommendations...</span>
            </div>
          )}
          
          {!recommendedLoading && (
            <>
              <div 
                ref={carouselRef}
                className="carousel-container flex overflow-x-auto scroll-smooth pb-4 scrollbar-hide gap-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {recommendedHotels && recommendedHotels.length > 0 ? (
                  recommendedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="flex-shrink-0 w-80"
                    >
                      <FeaturedAccommodationCard hotel={hotel} />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 w-full">
                    No other recommendations available
                  </div>
                )}
              </div>

              {/* Scroll indicator */}
              {recommendedHotels && recommendedHotels.length > 3 && (
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.ceil(recommendedHotels.length / 3) }, (_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"
                        onClick={() => {
                          if (carouselRef.current) {
                            carouselRef.current.scrollTo({
                              left: i * 400,
                              behavior: 'smooth'
                            });
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </>
  );
}

export default HotelDetailsPage;
