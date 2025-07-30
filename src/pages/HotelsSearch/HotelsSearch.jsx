import NavigationHeader from "../../components/Header/Header";
import SideNavigation from "../../components/SideBar/SideBar";
import SearchForm from "../../components/SearchInput/SearchInput";
import SearchFilters from "../../components/SearchFilters/SearchFilters";
import AccommodationCard from "../../components/HotelCard/HotelCard";
import { useEffect, useState } from "react";
import { ApiUrl } from "../../network/interceptor/ApiUrl";
import { useSearchParams } from "react-router-dom";
import notFound from "../../assets/images/not-found.png"
import { Breadcrumb, Card, Spinner, Badge } from 'flowbite-react';

function HotelsSearchPage() {
    const [searchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [additionalFilters, setAdditionalFilters] = useState({});
    

    const search = searchParams.get("q") || "";
    const country = searchParams.get("country") || "";
    const date = searchParams.get("date") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const rating = searchParams.get("rating") || "";
    const amenities = searchParams.get("amenities") || "";

    useEffect(()=>{
        setLoading(true);
        setError(null);
        
        ApiUrl.get("/hotels")
        .then((res)=>{
          setHotels(res.data);
          console.log("Hotels loaded:", res.data);
        })
        .catch((err) => {
          console.error("Error loading hotels:", err);
          setError("Failed to load hotels. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    },[])


    useEffect(() => {
        if (hotels.length > 0) {
            let filtered = hotels.filter((hotel) => {
        
                const nameMatch = !search || 
                    hotel.name.toLowerCase().includes(search.toLowerCase()) ||
                    (hotel.address && hotel.address.city && hotel.address.city.toLowerCase().includes(search.toLowerCase()));
                

                const countryMatch = !country || 
                    (hotel.address && hotel.address.countryIsoCode === country);
                

                const basePrice = hotel.pricing && hotel.pricing[0] ? hotel.pricing[0].discountedPrice : 100;
                const priceMatch = (!minPrice || basePrice >= parseInt(minPrice)) && 
                                 (!maxPrice || basePrice <= parseInt(maxPrice));
                

                const ratingMatch = !rating || 
                    (hotel.rating && hotel.rating >= parseInt(rating));
                

                const amenitiesMatch = !amenities || 
                    (hotel.amenities && amenities.split(',').every(amenity => 
                        hotel.amenities.some(hotelAmenity => 
                            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
                        )
                    ));
                

                const additionalPriceMatch = !additionalFilters.priceRange || 
                    (basePrice >= additionalFilters.priceRange[0] && basePrice <= additionalFilters.priceRange[1]);
                
                const additionalRatingMatch = !additionalFilters.rating || 
                    (hotel.rating && hotel.rating >= parseInt(additionalFilters.rating));
                
                const additionalAmenitiesMatch = !additionalFilters.amenities || additionalFilters.amenities.length === 0 ||
                    (hotel.amenities && additionalFilters.amenities.every(amenity => 
                        hotel.amenities.some(hotelAmenity => 
                            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
                        )
                    ));
                
                return nameMatch && countryMatch && priceMatch && ratingMatch && amenitiesMatch && 
                       additionalPriceMatch && additionalRatingMatch && additionalAmenitiesMatch;
            });
            
    
            if (additionalFilters.sortBy) {
                filtered = sortHotels(filtered, additionalFilters.sortBy);
            }
            
            setFilteredHotels(filtered);
        }
    }, [hotels, search, country, date, minPrice, maxPrice, rating, amenities, additionalFilters]);

    const getActiveFilters = () => {
        const filters = [];
        if (search) filters.push(`Search: "${search}"`);
        if (country) filters.push(`Country: ${country}`);
        if (minPrice || maxPrice) filters.push(`Price: $${minPrice || 0} - $${maxPrice || 1000}`);
        if (rating) filters.push(`Rating: ${rating}+ stars`);
        if (amenities) filters.push(`Amenities: ${amenities.split(',').join(', ')}`);
        return filters;
    };

    const clearFilter = (filterType) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(filterType);
        window.location.search = newParams.toString();
    };

    const sortHotels = (hotels, sortBy) => {
        const sorted = [...hotels];
        switch (sortBy) {
            case 'price_low':
                return sorted.sort((a, b) => {
                    const priceA = a.pricing && a.pricing[0] ? a.pricing[0].discountedPrice : 100;
                    const priceB = b.pricing && b.pricing[0] ? b.pricing[0].discountedPrice : 100;
                    return priceA - priceB;
                });
            case 'price_high':
                return sorted.sort((a, b) => {
                    const priceA = a.pricing && a.pricing[0] ? a.pricing[0].discountedPrice : 100;
                    const priceB = b.pricing && b.pricing[0] ? b.pricing[0].discountedPrice : 100;
                    return priceB - priceA;
                });
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'distance':
        
                return sorted;
            default:
                return sorted;
        }
    };

    const handleFiltersChange = (filters) => {
        setAdditionalFilters(filters);
    };

  return (
    <>
      <NavigationHeader />
      <SideNavigation />

      <section className="hotels-search w-full max-w-full md:w-[calc(100vw-320px)] md:ml-72 px-2 md:px-0">
        <SearchForm />

        <div className="breadcrumb-section mt-8">
          <Card className="p-5">
            <div className="flex justify-between items-center">
              <Breadcrumb aria-label="breadcrumb">
                <Breadcrumb.Item>Hotels</Breadcrumb.Item>
                <Breadcrumb.Item className="hotels-number">
                  total <span className="text-blue-600 font-bold">{filteredHotels.length} result{filteredHotels.length !== 1 ? 's' : ''}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
              
              {/* Active Filters */}
              {getActiveFilters().length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {getActiveFilters().map((filter, index) => (
                    <Badge key={index} color="blue" className="cursor-pointer hover:bg-blue-700">
                      {filter}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Additional Search Filters */}
        <SearchFilters onFiltersChange={handleFiltersChange} />
        
        <div className="filtered-hotels my-5">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Spinner size="xl" />
              <span className="ml-3 text-lg">Loading hotels...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <AccommodationCard key={hotel.id} hotel={hotel} />
                ))
              ) : (
                <div className="not-found flex flex-col items-center justify-center col-span-1 md:col-span-2 py-12">
                  <img src={notFound} alt="not found" className="w-40 h-40 md:w-64 md:h-64"/>
                  <p className="font-bold text-2xl mt-5">No Result Found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                  {getActiveFilters().length > 0 && (
                    <button 
                      onClick={() => window.location.href = '/hotelssearch'}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default HotelsSearchPage