'use client'

import { useEffect, useState } from 'react'
import {
  useKeenSlider,
  KeenSliderOptions,
} from 'keen-slider/react'

export const useAutoSlider = (options: KeenSliderOptions = {}) => {
  const [isSliderReady, setSliderReady] = useState(false)

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    ...options,
    created() {
      setSliderReady(true)
    },
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    let timeout: NodeJS.Timeout

    const startAutoSlide = () => {
      const slider = sliderInstanceRef.current
      if (!slider) return

      interval = setInterval(() => {
        try {
          slider.next()
        } catch (err) {
          console.error("Error while sliding:", err)
        }
      }, 3000)
    }

    if (isSliderReady) {
      timeout = setTimeout(startAutoSlide, 300) // slight delay for stability
    }

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isSliderReady, sliderInstanceRef]) // depend on readiness

  return { sliderRef, sliderInstanceRef }
}
