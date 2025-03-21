import rootTokens from '../../../tokens.json';

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

// Функция для получения значений из rootTokens
const duration = (value) => rootTokens.duration[value] || `${value}ms`;
const motion = (type) => rootTokens.motion[type] || 'cubic-bezier(0, 0, 1, 1)';

// Processed tokens generated from component/tokens.json
const processedTokens = {
  "THUMB_TRANSITION_DURATION": duration('300'),
  "THUMB_TRANSITION_EASING": motion('ease'),
  "THUMB_HOVER_DURATION": duration('300'),
  "THUMB_DRAG_DURATION": duration('200'),
  "THUMB_DRAG_EASING": motion('easeOut'),
  "THUMB_DOT_EXPAND_DURATION": duration('300'),
  "THUMB_DOT_COLLAPSE_DURATION": duration('300'),
  "THUMB_DOT_TRANSITION_EASING": motion('easeOut'),
  
  "AXIS_TRANSITION_DURATION": duration('200'),
  "AXIS_TRANSITION_EASING": motion('linear'),
  "AXIS_FILL_TRANSITION_DURATION": duration('200'),
  "AXIS_FILL_ACTIVE_DURATION": duration('0'),
  
  "COUNTER_TRANSITION_DURATION": duration('100'),
  "COUNTER_TRANSITION_EASING": motion('linear'),
  
  "SLIDER_ANIMATION_DURATION": duration('500'),
  "SLIDER_TRANSITION_DURATION": duration('300'),
  "SLIDER_TRANSITION_EASING": motion('easeOut')
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