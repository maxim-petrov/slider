import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Slider from './slider/Slider';
import rootTokens from './tokens.json';
import componentTokens from './slider/tokens/tokens.json';

// Simple error boundary slider
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Caught error:', error);
      setHasError(true);
      setError(error);
      return true;
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div style={{ color: 'red', padding: '20px', border: '1px solid red' }}>
        <h2>Something went wrong!</h2>
        <p>{error?.toString() || 'Unknown error'}</p>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }

  return children;
}

function App() {
  // Загружаем токены динамически из slider/tokens.json
  const [tokenValues, setTokenValues] = useState(() => {
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
  });

  // Дополнительные варианты длительности для тестирования долгих анимаций
  const longDurations = [
    { label: 'Очень долго (2000ms)', value: '2000ms' },
    { label: 'Супер долго (5000ms)', value: '5000ms' },
    { label: 'Ультра долго (10000ms)', value: '10000ms' },
    { label: 'Экстремально долго (20000ms)', value: '20000ms' },
    { label: 'Максимально долго (30000ms)', value: '30000ms' }
  ];

  // Получаем все доступные значения из основного tokens.json
  const availableDurations = [
    ...Object.entries(rootTokens.duration).map(([key, value]) => ({
      label: `${key} (${value})`,
      value: value
    })),
    ...longDurations
  ];

  const availableMotions = Object.entries(rootTokens.motion).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: value
  }));

  // Обновляем CSS переменные при изменении токенов
  useEffect(() => {
    Object.entries(tokenValues).forEach(([key, value]) => {
      const cssVarName = `--${key.toLowerCase().replace(/_/g, '-')}`;
      document.documentElement.style.setProperty(cssVarName, value);
      
      // Также обновляем переменные в токенах для JS
      try {
        // Динамически импортируем tokenUtils для обновления значений на лету
        import('./slider/tokens/utils/tokenUtils').then(module => {
          if (module.default && typeof module.default.updateToken === 'function') {
            module.default.updateToken(key, value);
          }
        });
      } catch (error) {
        console.error('Failed to update token in JS:', error);
      }
    });
  }, [tokenValues]);

  // Обработчик изменения значения токена
  const handleTokenChange = (tokenName) => (e) => {
    let newValue = e.target.value;
    
    // Для spring токенов преобразуем значение в число
    if (tokenName.includes('SPRING_STIFFNESS') || 
        tokenName.includes('SPRING_DAMPING') || 
        tokenName.includes('SPRING_MASS')) {
      newValue = parseFloat(newValue);
      
      // Проверяем на NaN и устанавливаем значение по умолчанию
      if (isNaN(newValue)) {
        if (tokenName.includes('SPRING_STIFFNESS')) {
          newValue = 200; // Default stiffness
        } else if (tokenName.includes('SPRING_DAMPING')) {
          newValue = 18; // Default damping
        } else if (tokenName.includes('SPRING_MASS')) {
          newValue = 1; // Default mass
        }
      }
    }
    
    setTokenValues(prev => ({
      ...prev,
      [tokenName]: newValue
    }));
  };

  // Группируем токены по типам
  const groupedTokens = Object.entries(tokenValues).reduce((acc, [key, value]) => {
    if (key.includes('DURATION')) {
      acc.duration.push([key, value]);
    } else if (key.includes('MOTION') || key.includes('EASING')) {
      acc.motion.push([key, value]);
    } else if (key.includes('SPRING')) {
      // Группируем spring токены по подтипам (STIFFNESS, DAMPING, MASS)
      if (key.includes('STIFFNESS')) {
        acc.springStiffness.push([key, value]);
      } else if (key.includes('DAMPING')) {
        acc.springDamping.push([key, value]);
      } else if (key.includes('MASS')) {
        acc.springMass.push([key, value]);
      }
    }
    return acc;
  }, { 
    duration: [], 
    motion: [], 
    springStiffness: [],
    springDamping: [],
    springMass: []
  });

  return (
    <>
      <ErrorBoundary>
        <Slider customTokens={tokenValues} />
      </ErrorBoundary>
      
      <div className="tokens-configurator">
        <h3>Настройка токенов анимации</h3>
        
        <div className="tokens-section">
          <h4>Токены длительности</h4>
          
          {groupedTokens.duration.map(([tokenName, tokenValue]) => (
            <div className="token-group" key={tokenName}>
              <label htmlFor={`token-${tokenName}`}>{tokenName}: </label>
              <select 
                id={`token-${tokenName}`}
                value={tokenValue}
                onChange={handleTokenChange(tokenName)}
              >
                <optgroup label="Из tokens.json">
                  {availableDurations.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Кастомные">
                  <option value="10ms">Очень быстро (10ms)</option>
                  <option value="25ms">Ультра-быстро (25ms)</option>
                  <option value="750ms">Очень медленно (750ms)</option>
                  <option value="1000ms">Максимальная длительность (1000ms)</option>
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
          ))}
        </div>
        
        <div className="tokens-section">
          <h4>Токены движения/плавности</h4>
          
          {groupedTokens.motion.map(([tokenName, tokenValue]) => (
            <div className="token-group" key={tokenName}>
              <label htmlFor={`token-${tokenName}`}>{tokenName}: </label>
              <select 
                id={`token-${tokenName}`}
                value={tokenValue}
                onChange={handleTokenChange(tokenName)}
              >
                <optgroup label="Из tokens.json">
                  {availableMotions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Кастомные">
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)">Bounce</option>
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
          ))}
        </div>
        
        {/* Добавляем секцию для Spring токенов */}
        {(groupedTokens.springStiffness.length > 0 || 
          groupedTokens.springDamping.length > 0 || 
          groupedTokens.springMass.length > 0) && (
          <div className="tokens-section">
            <h4>Токены Spring анимации</h4>
            
            {/* Stiffness tokens */}
            {groupedTokens.springStiffness.length > 0 && (
              <div className="spring-token-group">
                <h5>Жесткость (Stiffness)</h5>
                {groupedTokens.springStiffness.map(([tokenName, tokenValue]) => (
                  <div className="token-group" key={tokenName}>
                    <label htmlFor={`token-${tokenName}`}>{tokenName}: </label>
                    <input
                      type="number"
                      id={`token-${tokenName}`}
                      className="token-custom-value"
                      value={tokenValue}
                      onChange={handleTokenChange(tokenName)}
                      min="1"
                      max="1000"
                      step="10"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Damping tokens */}
            {groupedTokens.springDamping.length > 0 && (
              <div className="spring-token-group">
                <h5>Затухание (Damping)</h5>
                {groupedTokens.springDamping.map(([tokenName, tokenValue]) => (
                  <div className="token-group" key={tokenName}>
                    <label htmlFor={`token-${tokenName}`}>{tokenName}: </label>
                    <input
                      type="number"
                      id={`token-${tokenName}`}
                      className="token-custom-value"
                      value={tokenValue}
                      onChange={handleTokenChange(tokenName)}
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Mass tokens */}
            {groupedTokens.springMass.length > 0 && (
              <div className="spring-token-group">
                <h5>Масса (Mass)</h5>
                {groupedTokens.springMass.map(([tokenName, tokenValue]) => (
                  <div className="token-group" key={tokenName}>
                    <label htmlFor={`token-${tokenName}`}>{tokenName}: </label>
                    <input
                      type="number"
                      id={`token-${tokenName}`}
                      className="token-custom-value"
                      value={tokenValue}
                      onChange={handleTokenChange(tokenName)}
                      min="0.1"
                      max="10"
                      step="0.1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
