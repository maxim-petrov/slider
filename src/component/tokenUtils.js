import rootTokens from '../tokens.json';

// Создаем функцию для корректной обработки любых пользовательских значений
const parseTokenValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  
  // Преобразуем миллисекунды в числовое значение, если это нужно
  if (value.endsWith('ms')) {
    const match = value.match(/^(\d+)ms$/);
    if (match) {
      return value; // Оставляем как есть для CSS
    }
  }
  
  // Проверяем, это cubic-bezier или нет
  if (value.startsWith('cubic-bezier')) {
    return value;
  }
  
  return value;
};

// Create a simplified version with hardcoded values for now
// to ensure the app renders
const processedTokens = {
  // Durations
  LOCAL_DURATION_XS: '50ms',
  LOCAL_DURATION_S: '100ms',
  LOCAL_DURATION_M: '200ms',
  LOCAL_DURATION_L: '300ms',
  LOCAL_DURATION_XL: '500ms',
  
  // Motion
  LOCAL_MOTION_LINEAR: 'cubic-bezier(0, 0, 1, 1)',
  LOCAL_MOTION_EASE: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  LOCAL_MOTION_EASE_OUT: 'cubic-bezier(.165, .84, .44, 1)',
  LOCAL_MOTION_EASE_IN_OUT: 'cubic-bezier(.455, .03, .515, .955)',
  LOCAL_MOTION_SPRING: 'cubic-bezier(0.32, 1.72, 0, 1)'
};

// Метод для обновления токенов на лету
processedTokens.updateToken = function(tokenName, tokenValue) {
  if (this.hasOwnProperty(tokenName)) {
    this[tokenName] = parseTokenValue(tokenValue);
    return true;
  }
  return false;
};

// Log for debugging
console.log('TokenUtils loaded with values:', processedTokens);

export default processedTokens; 