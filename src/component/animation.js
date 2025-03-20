import { useEffect, useState } from 'react';

/**
 * Custom hook to manage slider animation state
 * @returns {[boolean, Function, Function]} Animation state and setter functions
 */
export const useSliderAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset animation state after it completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Time slightly longer than animation duration

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Start animation
  const startAnimation = () => setIsAnimating(true);

  // Stop animation
  const stopAnimation = () => setIsAnimating(false);

  return [isAnimating, startAnimation, stopAnimation];
};

/**
 * Generates the appropriate transition style based on dragging and animation states
 * @param {boolean} isDragging - Whether the slider is being dragged
 * @param {boolean} isAnimating - Whether the slider is animating
 * @returns {string} CSS transition style
 */
export const getSliderTransitionStyle = (isDragging, isAnimating) => {
  if (isDragging && !isAnimating) {
    return 'none'; // No animation when dragging
  }
  return isAnimating
    ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), right 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
    : 'none';
};

/**
 * Returns input element style when dragging
 * @param {boolean} isDragging - Whether the slider is being dragged
 * @returns {Object} Style object
 */
export const getInputDraggingStyle = (isDragging) => {
  if (isDragging) {
    return { pointerEvents: 'none' };
  }
  return {};
};

// Animation constants
export const SLIDER_ANIMATION = {
  DURATION_MS: 400,
  TRANSITION_DURATION: '0.35s',
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
};
