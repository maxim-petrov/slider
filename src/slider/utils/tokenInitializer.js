import rootTokens from '../../tokens.json';
import componentTokens from '../tokens/tokens.json';

/**
 * Initialize token values from component tokens json
 * @returns {Object} - Object with initialized token values
 */
export function initializeTokenValues() {
  // Преобразуем компонентные токены в начальное состояние
  const initialTokens = {};
  Object.entries(componentTokens).forEach(([key, value]) => {
    // Если значение ссылается на функцию tokens, получаем исходное значение
    if (typeof value === 'string' && value.startsWith('tokens.')) {
      // Например, из tokens.duration('100') извлекаем '100'
      const match = value.match(/tokens\.\w+\('([^']+)'\)/);
      if (match && match[1]) {
        const tokenKey = match[1];
        if (value.includes('duration')) {
          initialTokens[key] = rootTokens.duration[tokenKey] || value;
        } else if (value.includes('motion') || value.includes('easing')) {
          initialTokens[key] = rootTokens.motion[tokenKey] || value;
        } else {
          initialTokens[key] = value;
        }
      } else {
        initialTokens[key] = value;
      }
    } else {
      // Для прямых значений (например, для spring токенов)
      // Проверяем, является ли это spring токеном (STIFFNESS, DAMPING, MASS)
      if (key.includes('SPRING_STIFFNESS') || key.includes('SPRING_DAMPING') || key.includes('SPRING_MASS')) {
        // Преобразуем строковые значения в числа для spring токенов
        initialTokens[key] = parseFloat(value);
      } else {
        initialTokens[key] = value;
      }
    }
  });
  return initialTokens;
} 