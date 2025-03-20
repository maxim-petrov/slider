import { useEffect, useState } from 'react';
import tokens from './tokenUtils';


export const useSliderAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, parseInt(tokens.LOCAL_DURATION_XL));

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const startAnimation = () => setIsAnimating(true);

  const stopAnimation = () => setIsAnimating(false);

  return [isAnimating, startAnimation, stopAnimation];
};


export const getSliderTransitionStyle = (isDragging, isAnimating) => {
  if (isDragging && !isAnimating) {
    return 'none';
  }
  return isAnimating
    ? `left ${tokens.LOCAL_DURATION_L} ${tokens.LOCAL_MOTION_EASE_OUT}, right ${tokens.LOCAL_DURATION_L} ${tokens.LOCAL_MOTION_EASE_OUT}`
    : 'none';
};


export const getInputDraggingStyle = (isDragging) => {
  if (isDragging) {
    return { pointerEvents: 'none' };
  }
  return {};
};

export const SLIDER_ANIMATION = {
  DURATION_MS: parseInt(tokens.LOCAL_DURATION_XL),
  TRANSITION_DURATION: tokens.LOCAL_DURATION_L,
  EASING: tokens.LOCAL_MOTION_EASE_OUT,
};
