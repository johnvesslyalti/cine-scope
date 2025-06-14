'use client';

import { useEffect, useRef } from 'react';
import { useKeenSlider, KeenSliderOptions } from 'keen-slider/react';

export const useAutoSlider = (options: KeenSliderOptions = {}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    ...options,
    created(slider) {
      // Start auto-slide as soon as the slider is ready
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        try {
          slider.next();
        } catch (err) {
          console.error('Error during auto-slide:', err);
        }
      }, 3000);
    },
    destroyed() {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
  });

  // Extra cleanup just in case
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { sliderRef, sliderInstanceRef };
};
