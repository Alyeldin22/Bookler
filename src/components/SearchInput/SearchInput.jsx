import CustomButton from "../Button/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Select, RangeSlider } from 'flowbite-react';

function SearchForm() {
    const [search, setSearch] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [rating, setRating] = useState("");
    const [amenities, setAmenities] = useState([]);
    const navigate = useNavigate();

    const countries = [
        { label: "All Countries", value: "" },
        { label: "United States", value: "US" },
        { label: "Morocco", value: "MA" },
        { label: "Egypt", value: "EG" },
        { label: "Greece", value: "GR" },
    ];

    const ratings = [
        { label: "Any Rating", value: "" },
        { label: "5 Stars", value: "5" },
        { label: "4+ Stars", value: "4" },
        { label: "3+ Stars", value: "3" },
        { label: "2+ Stars", value: "2" },
    ];

    const availableAmenities = [
        "WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking", "Air Conditioning"
    ];

    const handleClear = () => {
        setSearch("");
        setCountry("");
        setDate("");
        setPriceRange([0, 1000]);
        setRating("");
        setAmenities([]);
    };

    const handleAmenityToggle = (amenity) => {
        setAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.append("q", search);
        if (country) params.append("country", country);
        if (date) params.append("date", date);
        if (priceRange[0] > 0) params.append("minPrice", priceRange[0]);
        if (priceRange[1] < 1000) params.append("maxPrice", priceRange[1]);
        if (rating) params.append("rating", rating);
        if (amenities.length > 0) params.append("amenities", amenities.join(","));
        
        navigate(`/hotelssearch?${params.toString()}`);
    }

  return (
    <section className="bg-white p-6 -mt-12 relative z-10 rounded-3xl shadow-lg">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Basic Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="search" className="text-gray-400 text-xs uppercase mb-2 ml-2">search</label>
            <TextInput 
              type="text" 
              id="search" 
              value={search} 
              placeholder="Hotel Name or Location" 
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full bg-gray-100 border-none"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="country" className="text-gray-400 text-xs uppercase mb-2 ml-2">country</label>
            <Select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-full bg-gray-100 border-none"
            >
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="text-gray-400 text-xs uppercase mb-2 ml-2">check-in</label>
            <TextInput 
              type="date" 
              id="date" 
              name="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="rounded-full bg-gray-100 border-none"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="rating" className="text-gray-400 text-xs uppercase mb-2 ml-2">rating</label>
            <Select 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              className="rounded-full bg-gray-100 border-none"
            >
              {ratings.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-gray-400 text-xs uppercase mb-2 ml-2">price range</label>
          <div className="px-4">
            <RangeSlider
              min={0}
              max={1000}
              value={priceRange}
              onChange={(e) => setPriceRange([parseInt(e.target.value.split(',')[0]), parseInt(e.target.value.split(',')[1])])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <label className="text-gray-400 text-xs uppercase mb-2 ml-2">amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availableAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <div 
            onClick={handleClear} 
            className="px-10 py-3 rounded-full capitalize bg-white text-gray-800 font-bold border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            clear filters
          </div>
          
          <CustomButton 
            type="submit"
            className="bg-red-600 text-white hover:bg-red-700" 
            title="search" 
          />
        </div>
      </form>
    </section>
  )
}

export default SearchForm