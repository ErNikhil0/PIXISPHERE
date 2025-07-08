import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PhotographerCard = memo(({ photographer }) => {
  if (!photographer || !photographer.id) {
    console.error('Invalid photographer data:', photographer);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <Link 
        to={`/photographers/${photographer.id}`}
        className="block h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
        aria-label={`View ${photographer.name}'s profile`}
      >
        {/* Image Container  */}
        <div className="relative pb-[56.25%] overflow-hidden">
          {!photographer.profilePic && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <motion.img
            src={photographer.profilePic || '/placeholder-photographer.jpg'}
            alt={photographer.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = '/placeholder-photographer.jpg';
            }}
          />
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg line-clamp-1">{photographer.name}</h3>
              <p className="text-gray-600 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {photographer.location}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">₹{photographer.price.toLocaleString()}</p>
              <div className="flex items-center justify-end mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(photographer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {photographer.styles?.slice(0, 3).map((style) => (
              <motion.span
                key={style}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full cursor-default"
              >
                {style}
              </motion.span>
            ))}
            {photographer.styles?.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{photographer.styles.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

PhotographerCard.displayName = 'PhotographerCard'; 

export default PhotographerCard;