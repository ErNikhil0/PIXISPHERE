import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PhotographersContext = createContext();

export const PhotographersProvider = ({ children }) => {
  const [photographers, setPhotographers] = useState([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    priceRange: [0, 50000],
    minRating: 0,
    styles: [],
    sortBy: 'rating'
  });

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/photographers');
        setPhotographers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photographers:', error);
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...photographers];
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.location.toLowerCase().includes(searchTerm) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.location) {
        result = result.filter(p => p.location === filters.location);
      }
      
      result = result.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
      
      if (filters.minRating > 0) {
        result = result.filter(p => p.rating >= filters.minRating);
      }
      
      if (filters.styles.length > 0) {
        result = result.filter(p => 
          filters.styles.every(style => p.styles.includes(style))
        );
      }
      
      switch (filters.sortBy) {
        case 'price':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'recent':
          result.sort((a, b) => b.id - a.id);
          break;
        default:
          break;
      }
      
      setFilteredPhotographers(result);
    };
    
    if (photographers.length) {
      applyFilters();
    }
  }, [photographers, filters]);

  return (
    <PhotographersContext.Provider
      value={{
        photographers: filteredPhotographers,
        loading,
        filters,
        setFilters
      }}
    >
      {children}
    </PhotographersContext.Provider>
  );
};

export const usePhotographers = () => useContext(PhotographersContext);