import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotographers } from '../Context/PhotographersContext';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import FilterSidebar from '../components/common/FilterSidebar';
import PhotographerCard from '../components/common/PhotographerCard';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function Home() {
  const { photographers, loading, filters, setFilters } = usePhotographers();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  // Optimize card rendering with memoization
  const renderPhotographerCards = () => {
    return photographers.slice(0, visibleCount).map((photographer) => (
      <motion.div
        key={photographer.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="cursor-pointer"
      >
        <PhotographerCard photographer={photographer} />
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {isFilterOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Hide Filters
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Show Filters
              </>
            )}
          </button>
          
          {/* Filter Sidebar */}
          <AnimatePresence>
            {(isFilterOpen || !isMobile) && (
              <>
                {isMobile && isFilterOpen && (
                  <div 
                    onClick={() => setIsFilterOpen(false)}
                    className="fixed inset-0 z-10 bg-black bg-opacity-50 cursor-pointer"
                  />
                )}
                <motion.div 
                  initial={{ x: isMobile ? -300 : 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: isMobile ? -300 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${isMobile ? 'fixed' : 'relative'} inset-y-0 left-0 z-20 w-72 bg-white shadow-lg md:shadow-none md:w-1/4`}
                >
                  <FilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    onClose={() => setIsFilterOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <SearchBar />
            
            {/* Smart Suggestion */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 p-4 rounded-lg mb-6 cursor-default"
            >
              <h3 className="font-semibold text-blue-800">
                {filters.styles?.length > 0 
                  ? `Top ${filters.styles.join(', ')} photographers in ${filters.location || 'your area'}`
                  : `Top photographers in ${filters.location || 'your area'}`}
              </h3>
            </motion.div>
            
            {/* Photographers Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {renderPhotographerCards()}
              </motion.div>
            )}
            
            {/* Load More button */}
            {photographers.length > visibleCount && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex justify-center"
              >
                <button 
                  onClick={loadMore}
                  className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition cursor-pointer font-medium"
                >
                  Load More Photographers
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}