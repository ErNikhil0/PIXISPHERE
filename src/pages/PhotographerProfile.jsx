import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePhotographers } from '../context/PhotographersContext';
import Header from '../components/common/Header';
import Gallery from '../components/profile/Gallery';
import Reviews from '../components/profile/Reviews';
import InquiryModal from '../components/profile/InquiryModal';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function PhotographerProfile() {
  const { id } = useParams();
  const { photographers, loading, error, fetchPhotographers } = usePhotographers();
  const [photographer, setPhotographer] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Robust photographer lookup with retry logic
  useEffect(() => {
    if (!id) return;

    const findPhotographer = () => {
      // Case-insensitive and type-agnostic ID comparison
      const found = photographers.find(p => 
        p.id.toString().toLowerCase() === id.toString().toLowerCase()
      );

      if (!found && retryCount < 3) {
        console.warn(`Retry ${retryCount + 1}: Photographer not found, refetching...`);
        fetchPhotographers();
        setRetryCount(prev => prev + 1);
      } else {
        setPhotographer(found || null);
      }
    };

    findPhotographer();
  }, [id, photographers, retryCount, fetchPhotographers]);

  // Debug logs (remove in production)
  console.log({
    idFromURL: id,
    availableIDs: photographers.map(p => p.id),
    currentPhotographer: photographer
  });

  if (loading && !photographer) {
    return <SkeletonProfile />;
  }

  if (error) {
    return (
      <ErrorScreen 
        message={`Failed to load data: ${error}`}
        onRetry={fetchPhotographers}
      />
    );
  }

  if (error || !photographer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Photographer not found</h1>
            <p className="mt-2 text-gray-600">
              ID: {id} | Available IDs: {photographers.map(p => p.id).join(', ')}
            </p>
            <div className="mt-4 space-x-2">
              <button 
                onClick={() => window.history.back()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Go Back
              </button>
              <button 
                onClick={fetchPhotographers}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Profile Header */}
          <div className="md:flex">
            <div className="md:w-1/3 p-6">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img 
                  src={photographer.profilePic || '/placeholder-photographer.jpg'} 
                  alt={photographer.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.src = '/placeholder-photographer.jpg';
                    setImageLoading(false);
                  }}
                />
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-900">{photographer.name}</h1>
              
              <div className="flex items-center mt-2">
                <span className="text-gray-600 flex items-center">
                  <LocationIcon />
                  {photographer.location}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-yellow-500 font-semibold flex items-center">
                  <StarIcon />
                  {photographer.rating}
                </span>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {photographer.bio || 'No bio available'}
                </p>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {photographer.styles.map(style => (
                    <SpecializationBadge key={style} style={style} />
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PriceDisplay price={photographer.price} />
                <InquiryButton onClick={() => setIsInquiryOpen(true)} />
              </div>
            </div>
          </div>
          
          <GallerySection images={photographer.portfolio} />
          <ReviewsSection reviews={photographer.reviews} />
        </motion.div>
      </main>

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        photographer={photographer}
      />
    </div>
  );
}

// Helper Components
function SkeletonProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonLoader className="h-64" />
          <div className="md:col-span-2 space-y-4">
            <SkeletonLoader className="h-8 w-3/4" />
            <SkeletonLoader className="h-4 w-1/2" />
            <SkeletonLoader className="h-4 w-full" />
            <SkeletonLoader className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error Loading Data</h1>
          <p className="mt-2 text-gray-600">{message}</p>
          <button
            onClick={onRetry}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function SpecializationBadge({ style }) {
  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-default"
    >
      {style}
    </motion.span>
  );
}

function PriceDisplay({ price }) {
  return (
    <div>
      <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
      <span className="text-gray-600 ml-1">/ session</span>
    </div>
  );
}

function InquiryButton({ onClick }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-md"
    >
      Send Inquiry
    </motion.button>
  );
}

function GallerySection({ images = [] }) {
  return (
    <div className="px-6 pb-8">
      <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
      <Gallery images={images} />
    </div>
  );
}

function ReviewsSection({ reviews = [] }) {
  return (
    <div className="px-6 pb-8">
      <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
      <Reviews reviews={reviews} />
    </div>
  );
}