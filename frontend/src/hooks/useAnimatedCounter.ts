import { useState, useEffect } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  delay?: number;
  easingFunction?: (t: number) => number;
}

export const useAnimatedCounter = (
  endValue: number,
  options: UseAnimatedCounterOptions = {}
) => {
  const {
    duration = 2000,
    delay = 0,
    easingFunction = (t: number) => t * t * (3 - 2 * t) // Smooth step function
  } = options;

  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (endValue === 0) {
      setCurrentValue(0);
      return;
    }

    const animateCounter = () => {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = currentValue;
      const valueChange = endValue - startValue;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunction(progress);
        
        const newValue = Math.floor(startValue + (valueChange * easedProgress));
        setCurrentValue(newValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentValue(endValue);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(animateCounter, delay);
    return () => clearTimeout(timeoutId);
  }, [endValue, duration, delay, easingFunction]);

  return { value: currentValue, isAnimating };
};