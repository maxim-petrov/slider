import { useEffect, useState } from 'react';
import tokens from '../tokens/utils/tokenUtils.js';

// Функция для извлечения значения ms из строки, например "10000ms" -> 10000
const extractMs = (duration) => {
  if (typeof duration !== 'string') return 500; // значение по умолчанию
  
  const match = duration.match(/(\d+)ms/);
  if (match && match[1]) {
    return parseInt(match[1]);
  }
  return 500; // значение по умолчанию, если не удалось распарсить
};

export const useSliderAnimation = (customDuration = null) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      // Используем пользовательское значение длительности, если оно передано
      // иначе используем значение из токенов
      const animationDuration = customDuration 
        ? extractMs(customDuration)
        : parseInt(tokens.SLIDER_ANIMATION_DURATION);
      
      // Устанавливаем таймер, который ВСЕГДА больше длительности анимации
      // чтобы никогда не обрезать анимацию
      const durationWithBuffer = animationDuration + 100;
      
      console.log(`Animation will run for ${durationWithBuffer}ms`);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, durationWithBuffer);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, customDuration]);

  const startAnimation = () => setIsAnimating(true);

  const stopAnimation = () => setIsAnimating(false);

  return [isAnimating, startAnimation, stopAnimation];
};


export const getSliderTransitionStyle = (isDragging, isAnimating) => {
  if (isDragging && !isAnimating) {
    return 'none';
  }
  return isAnimating
    ? `left ${tokens.SLIDER_TRANSITION_DURATION} ${tokens.SLIDER_TRANSITION_EASING}, right ${tokens.SLIDER_TRANSITION_DURATION} ${tokens.SLIDER_TRANSITION_EASING}`
    : 'none';
};


export const getInputDraggingStyle = (isDragging) => {
  if (isDragging) {
    return { pointerEvents: 'none' };
  }
  return {};
};

export const SLIDER_ANIMATION = {
  DURATION_MS: parseInt(tokens.SLIDER_ANIMATION_DURATION),
  TRANSITION_DURATION: tokens.SLIDER_TRANSITION_DURATION,
  EASING: tokens.SLIDER_TRANSITION_EASING,
};
