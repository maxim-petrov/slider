import { useState, useEffect } from 'react';
import rootTokens from '../tokens.json';

function TokenConfig({ 
  onTokenChange, 
  tokenValues: initialTokenValues, 
  componentTokens, 
  tokenDescriptions = {},
  componentNames = {
    'THUMB': 'Ползунок',
    'AXIS': 'Ось слайдера',
    'COUNTER': 'Счетчик',
    'SLIDER': 'Общие настройки'
  },
  title = "Настройка токенов анимации"
}) {
  const [tokenValues, setTokenValues] = useState(initialTokenValues);

  // Update the parent component when tokenValues change
  useEffect(() => {
    onTokenChange(tokenValues);
  }, [tokenValues, onTokenChange]);

  // Загружаем все доступные значения из основного tokens.json
  const availableDurations = Object.entries(rootTokens.duration).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: value
  }));

  const availableMotions = Object.entries(rootTokens.motion).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: value
  }));

  // Обработчик изменения значения токена
  const handleTokenChange = (tokenName) => (e) => {
    let newValue = e.target.value;
    setTokenValues(prev => ({
      ...prev,
      [tokenName]: newValue
    }));
  };

  // Функция для получения описания токена или использования технического названия если описание отсутствует
  const getTokenDescription = (tokenName) => {
    const description = tokenDescriptions[tokenName];
    if (description === '__HIDDEN__') return null;
    return description || tokenName;
  };

  // Отбираем только токены анимации без группировки по компонентам
  const animationTokens = Object.entries(tokenValues).filter(([key]) => 
    key.includes('DURATION') || key.includes('MOTION') || key.includes('EASING')
  );

  return (
    <div className="tokens-configurator">
      <h3>{title}</h3>
      
      <div className="tokens-section">
        <h4>Токены анимации</h4>
        
        <div className="tokens-flat-list">
          {animationTokens.map(([tokenName, tokenValue]) => {
            const description = getTokenDescription(tokenName);
            if (description === null) return null; // Пропускаем скрытые токены
            
            // Определяем, какие элементы управления отображать в зависимости от типа токена
            const isEasing = tokenName.includes('EASING') || tokenName.includes('MOTION');
            const isDuration = tokenName.includes('DURATION');
            
            return (
              <div className="token-group" key={tokenName}>
                <div className="token-description">
                  <label htmlFor={`token-${tokenName}`}>{description}</label>
                  <span className="token-technical-name">{tokenName}</span>
                </div>
                <div className="token-controls">
                  <select 
                    id={`token-${tokenName}`}
                    value={tokenValue}
                    onChange={handleTokenChange(tokenName)}
                  >
                    <optgroup label="Из tokens.json">
                      {isEasing && availableMotions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      {isDuration && availableDurations.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  
                  <input
                    type="text"
                    className="token-custom-value"
                    value={tokenValue}
                    onChange={handleTokenChange(tokenName)}
                    placeholder="Введите значение"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TokenConfig; 