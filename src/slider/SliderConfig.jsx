import { useState, useEffect } from 'react';
import rootTokens from '../tokens.json';
import componentTokens from './tokens/tokens.json';
import tokenDescriptions from './tokens/tokenDescriptions';

function SliderConfig({ onTokenChange, tokenValues: initialTokenValues }) {
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

  // Функция для получения названия компонента из токена
  const getComponentFromToken = (tokenName) => {
    const parts = tokenName.split('_');
    return parts[0];
  };

  // Группируем токены по типам и сортируем их по названию компонента
  const groupedTokens = Object.entries(tokenValues).reduce((acc, [key, value]) => {
    if (key.includes('DURATION') || key.includes('MOTION') || key.includes('EASING')) {
      // Объединяем токены длительности и плавности в одну группу
      acc.animation.push([key, value]);
    }
    return acc;
  }, { 
    animation: [] // Объединяем duration и motion в одну группу
  });

  // Сортируем токены по компонентам (THUMB, AXIS, COUNTER, SLIDER)
  const sortTokens = (tokens) => {
    return [...tokens].sort((a, b) => {
      const compA = a[0].split('_')[0];
      const compB = b[0].split('_')[0];
      return compA.localeCompare(compB);
    });
  };

  // Сортируем все группы токенов
  Object.keys(groupedTokens).forEach(key => {
    groupedTokens[key] = sortTokens(groupedTokens[key]);
  });

  // Функция для группировки токенов по компонентам
  const groupTokensByComponent = (tokens) => {
    return tokens.reduce((acc, token) => {
      const componentName = getComponentFromToken(token[0]);
      if (!acc[componentName]) {
        acc[componentName] = [];
      }
      acc[componentName].push(token);
      return acc;
    }, {});
  };

  // Группируем токены по компонентам
  const animationByComponent = groupTokensByComponent(groupedTokens.animation);

  // Функция для перевода названия компонента на русский
  const getComponentTranslation = (componentName) => {
    const translations = {
      'THUMB': 'Ползунок',
      'AXIS': 'Ось слайдера',
      'COUNTER': 'Счетчик',
      'SLIDER': 'Общие настройки'
    };
    return translations[componentName] || componentName;
  };

  // Функция для сортировки токенов в правильном порядке
  const sortTokensInPairs = (componentTokens) => {
    // Создаем объект для хранения пар токенов
    const tokenPairs = {};
    
    // Группируем токены по базовому имени (без DURATION/EASING)
    componentTokens.forEach(token => {
      const tokenName = token[0];
      const baseName = tokenName.replace('_DURATION', '').replace('_EASING', '').replace('_MOTION', '');
      
      if (!tokenPairs[baseName]) {
        tokenPairs[baseName] = [];
      }
      tokenPairs[baseName].push(token);
    });
    
    // Сортируем токены в порядке DURATION, затем EASING для каждого базового имени
    let result = [];
    Object.entries(tokenPairs).forEach(([baseName, tokens]) => {
      // Находим токен длительности
      const durationToken = tokens.find(t => t[0].includes('DURATION'));
      // Находим токен плавности
      const easingToken = tokens.find(t => t[0].includes('EASING') || t[0].includes('MOTION'));
      
      // Сначала добавляем токен длительности, если он есть
      if (durationToken) {
        result.push(durationToken);
      }
      
      // Затем добавляем токен плавности, если он есть
      if (easingToken) {
        result.push(easingToken);
      }
    });
    
    return result;
  };
  
  // Применяем новый порядок сортировки к каждому компоненту
  Object.keys(animationByComponent).forEach(componentName => {
    animationByComponent[componentName] = sortTokensInPairs(animationByComponent[componentName]);
  });

  return (
    <div className="tokens-configurator">
      <h3>Настройка токенов анимации</h3>
      
      <div className="tokens-section">
        <h4>Токены анимации</h4>
        
        {Object.entries(animationByComponent).map(([componentName, tokens]) => (
          <div key={componentName} className={`component-group component-group-${componentName}`}>
            {tokens.map(([tokenName, tokenValue]) => {
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
        ))}
      </div>
    </div>
  );
}

export default SliderConfig; 