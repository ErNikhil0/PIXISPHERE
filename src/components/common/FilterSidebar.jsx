import { useCallback } from 'react';
import PriceRangeSlider from './PriceRangeSlider';

export default function FilterSidebar({ filters, setFilters, onClose }) {
  const locations = ['Bengaluru', 'Delhi', 'Mumbai', 'Hyderabad'];
  const allStyles = ['Outdoor', 'Studio', 'Candid', 'Indoor', 'Traditional'];
  
  const handleStyleChange = (style) => {
    setFilters(prev => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter(s => s !== style)
        : [...prev.styles, style]
    }));
  };

  const handlePriceChange = useCallback((newRange) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newRange
    }));
  }, [setFilters]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button 
          onClick={onClose}
          className="md:hidden text-gray-500 hover:text-gray-700 cursor-pointer p-1"
          aria-label="Close filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Location</h3>
          <select
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Price Range</h3>
          <PriceRangeSlider 
            value={filters.priceRange}
            onChange={handlePriceChange}
            min={0}
            max={50000}
          />
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Minimum Rating</h3>
          <select
            value={filters.minRating}
            onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value={0}>Any Rating</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Photography Styles</h3>
          <div className="space-y-3">
            {allStyles.map(style => (
              <label key={style} className="flex items-center space-x-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition
                  ${filters.styles.includes(style) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 group-hover:border-blue-300'}`}
                >
                  {filters.styles.includes(style) && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-700 group-hover:text-blue-600 transition">{style}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">Sort By</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="rating">Rating: High to Low</option>
            <option value="price">Price: Low to High</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>

        <button
          onClick={() => setFilters({
            location: '',
            priceRange: [0, 50000],
            minRating: 0,
            styles: [],
            sortBy: 'rating'
          })}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition cursor-pointer font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}