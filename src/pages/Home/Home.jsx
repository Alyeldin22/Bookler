import NavigationHeader from "../../components/Header/Header";
import SideNavigation from "../../components/SideBar/SideBar";
import SearchForm from "../../components/SearchInput/SearchInput";
import FeaturedAccommodationCard from "../../components/RecommendedCard/RecommendedCard"
import { useEffect, useState, useRef } from "react";
import { ApiUrl } from "../../network/interceptor/ApiUrl";
import { Card, Spinner, Button } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
  const [recommendedHotels, setRecommendedHotels] = useState(null);
  const [bestOffers, setBestOffers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [sidebarShrink, setSidebarShrink] = useState(false);

  //fetch recommended hotels data
  useEffect(()=>{
    setLoading(true);
    setError(null);
    
    Promise.all([
      ApiUrl.get("/recommended_hotels"),
      ApiUrl.get("/best_offer")
    ])
    .then(([hotelsRes, offersRes]) => {
      setRecommendedHotels(hotelsRes.data);
      setBestOffers(offersRes.data);
      console.log("Hotels:", hotelsRes.data);
      console.log("Offers:", offersRes.data);
    })
    .catch((err) => {
      console.error("API Error:", err);
      setError("Failed to load data. Please try again later.");
    })
    .finally(() => {
      setLoading(false);
    });
  },[])

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
  
  return (
    <section className="relative bg-gray-100 overflow-hidden">
      <NavigationHeader />
      <SideNavigation onShrinkChange={setSidebarShrink} />
      {/* Responsive main content wrapper */}
      <div className={`home-content max-w-full w-full md:w-[calc(100vw-320px)] px-2 md:px-0 transition-all duration-300 ${sidebarShrink ? 'md:ml-20' : 'md:ml-72'}`}>
        <SearchForm />

        {loading && (
          <div className="flex justify-center items-center mt-12">
            <Spinner size="xl" />
            <span className="ml-3 text-lg">Loading data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-12">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="recommended-hotels w-full mx-auto mt-12 relative">
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
                <h3 className="capitalize font-bold text-2xl">Recommended Hotels</h3>
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
              
              <div 
                ref={carouselRef}
                className="carousel-container flex overflow-x-auto scroll-smooth pb-4 scrollbar-hide gap-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {recommendedHotels && recommendedHotels.length > 0 ? (
                  recommendedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="card-wrapper flex-shrink-0 w-72 md:w-80"
                    >
                      <FeaturedAccommodationCard hotel={hotel} />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 w-full">
                    No recommended hotels available
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
            </section>

            <section className="offers mt-12 bg-white p-4 md:p-6 rounded-3xl mb-12">
              <h3 className="capitalize font-bold text-2xl py-5 mb-6">Best Offers</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bestOffers && bestOffers.length > 0 ? (
                  bestOffers.map((offer) => (
                    <div key={offer.id} className="col-span-1">
                      <Card className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="offer-img h-16 w-16">
                          <img
                            src={offer.image}
                            alt="offer"
                            className="w-full h-full object-cover rounded-full border-2 border-white shadow-md"
                          />
                        </div>
                        <div className="offer-details text-start flex-1">
                          <h5 className="mb-2 text-lg font-semibold text-gray-800">{offer.location}</h5>
                          <p className="mb-0 text-sm text-gray-600">{offer.name}</p>
                          <div className="mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Special Offer
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 col-span-3">
                    No best offers available
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
}

export default HomePage