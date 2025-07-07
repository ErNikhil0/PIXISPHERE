import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

export default function useFilters(initialFilters) {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  // Memoized filtered photographers for better performance
  const filteredPhotographers = useMemo(() => {
    if (!photographers.length) return [];
    
    let result = [...photographers];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.location.toLowerCase().includes(searchTerm) ||
        (p.styles && p.styles.some(style => style.toLowerCase().includes(searchTerm)))
      );
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply price range filter (fixed)
    if (filters.priceRange) {
      result = result.filter(p => 
        p.price >= filters.priceRange[0] && 
        p.price <= filters.priceRange[1]
      );
    }
    
    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }
    
    // Apply styles filter
    if (filters.styles && filters.styles.length > 0) {
      result = result.filter(p => 
        p.styles && filters.styles.some(style => 
          p.styles.includes(style)
        )
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price':
        return [...result].sort((a, b) => a.price - b.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      case 'recent':
        return [...result].sort((a, b) => b.id - a.id);
      default:
        return result;
    }
  }, [photographers, filters]);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/photographers');
        setPhotographers(response.data);
      } catch (error) {
        console.error('Error fetching photographers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, []);

  return {
    photographers: filteredPhotographers,
    loading,
    filters,
    setFilters,
  };
}