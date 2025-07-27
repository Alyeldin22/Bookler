import { useState } from 'react';
import { Card, RangeSlider, Checkbox, Button } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

function SearchFilters({ onFiltersChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    priceRange: initialFilters.priceRange || [0, 1000],
    rating: initialFilters.rating || '',
    amenities: initialFilters.amenities || [],
    sortBy: initialFilters.sortBy || 'relevance',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'gym', label: 'Fitness Center', icon: '💪' },
    { id: 'spa', label: 'Spa', icon: '🧖' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'bar', label: 'Bar', icon: '🍷' },
    { id: 'parking', label: 'Free Parking', icon: '🅿️' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { id: 'breakfast', label: 'Free Breakfast', icon: '🍳' },
    { id: 'pets', label: 'Pet Friendly', icon: '🐕' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Distance' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenityId) => {
    const newAmenities = filters.amenities.includes(amenityId)
      ? filters.amenities.filter(id => id !== amenityId)
      : [...filters.amenities, amenityId];
    
    handleFilterChange('amenities', newAmenities);
  };

  const handlePriceRangeChange = (range) => {
    handleFilterChange('priceRange', range);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: [0, 1000],
      rating: '',
      amenities: [],
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.rating) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.sortBy !== 'relevance') count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="text-blue-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {getActiveFiltersCount() > 0 && (
            <Button
              size="sm"
              color="gray"
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faTimes} />
              Clear All
            </Button>
          )}
          <Button
            size="sm"
            color="gray"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (per night)
            </label>
            <div className="px-2">
              <RangeSlider
                min={0}
                max={1000}
                value={filters.priceRange}
                onChange={(e) => {
                  const [min, max] = e.target.value.split(',').map(Number);
                  handlePriceRangeChange([min, max]);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={option.value}
                    checked={filters.rating === option.value}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {amenities.map((amenity) => (
                <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">{amenity.icon} {amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              color="blue"
              onClick={() => onFiltersChange(filters)}
              className="flex-1"
            >
              Apply Filters
            </Button>
            <Button
              size="sm"
              color="gray"
              onClick={clearAllFilters}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default SearchFilters; 