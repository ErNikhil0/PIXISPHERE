import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Gallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div>
      <div className="relative h-64 md:h-96 mb-4 rounded-lg overflow-hidden">
        <motion.img
          key={selectedImage}
          src={images[selectedImage] || '/placeholder-image.jpg'}
          alt="Photographer's work"
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm">
            {selectedImage + 1} of {images.length}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`h-20 rounded overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
          >
            <img
              src={image || '/placeholder-image.jpg'}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}