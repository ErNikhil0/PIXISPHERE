import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PriceRangeSlider({ value, onChange, min = 0, max = 50000 }) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  // Sync internal state when props change
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    const constrainedMin = Math.min(newMin, maxVal - 1000); // Ensure minimum gap
    setMinVal(constrainedMin);
    onChange([constrainedMin, maxVal]);
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    const constrainedMax = Math.max(newMax, minVal + 1000); // Ensure minimum gap
    setMaxVal(constrainedMax);
    onChange([minVal, constrainedMax]);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-4">
        <div className="text-sm font-medium bg-blue-50 px-3 py-1 rounded-md">
          {formatCurrency(minVal)}
        </div>
        <div className="text-sm font-medium bg-blue-50 px-3 py-1 rounded-md">
          {formatCurrency(maxVal)}
        </div>
      </div>

      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${((minVal - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxVal - min) / (max - min)) * 100}%`,
          }}
        />
      </div>

      <div className="relative mt-4">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none opacity-0 cursor-pointer z-10"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none opacity-0 cursor-pointer z-10"
        />

        <motion.div
          className="absolute top-0 w-5 h-5 -ml-2.5 bg-blue-600 rounded-full shadow cursor-pointer transform -translate-y-1/2"
          style={{ left: `${((minVal - min) / (max - min)) * 100}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
        <motion.div
          className="absolute top-0 w-5 h-5 -ml-2.5 bg-blue-600 rounded-full shadow cursor-pointer transform -translate-y-1/2"
          style={{ left: `${((maxVal - min) / (max - min)) * 100}%` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
}