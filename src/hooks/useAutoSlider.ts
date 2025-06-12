'use client'

import { useEffect } from 'react'
import {
  useKeenSlider,
  KeenSliderOptions,
} from 'keen-slider/react'

export const useAutoSlider = (options: KeenSliderOptions = {}) => {
  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    ...options,
  })

  useEffect(() => {
    let interval: NodeJS.Timeout

    const startAutoSlide = () => {
      const slider = sliderInstanceRef.current
      if (!slider) return

      interval = setInterval(() => {
        if (slider) {
          slider.next()
        }
      }, 3000)
    }

    // Give slider time to initialize fully
    const timeout = setTimeout(startAutoSlide, 500)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, []) // ✅ Empty dependency array

  return { sliderRef, sliderInstanceRef }
}
