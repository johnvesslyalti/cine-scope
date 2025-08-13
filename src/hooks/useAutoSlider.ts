'use client';

import { useEffect, useRef } from 'react';
import { useKeenSlider, KeenSliderOptions } from 'keen-slider/react';

export const useAutoSlider = (options: KeenSliderOptions = {}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sliderAliveRef = useRef(true); // track if slider is alive

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    ...options,
    created(slider) {
      sliderAliveRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (!sliderAliveRef.current) return; // guard against destroyed slider
        try {
          slider.next();
        } catch (err) {
          console.error('Error during auto-slide:', err);
        }
      }, 3000);
    },
    destroyed() {
      sliderAliveRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
  });

  // Extra cleanup on unmount
  useEffect(() => {
    return () => {
      sliderAliveRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { sliderRef, sliderInstanceRef };
};
