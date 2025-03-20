import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Slider from './component/Slider';
import rootTokens from './tokens.json';

// Simple error boundary component
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
  // Инициализируем состояние для всех токенов
  const [tokenValues, setTokenValues] = useState({
    // Duration tokens
    LOCAL_DURATION_XS: '50ms',
    LOCAL_DURATION_S: '100ms',
    LOCAL_DURATION_M: '200ms',
    LOCAL_DURATION_L: '300ms',
    LOCAL_DURATION_XL: '500ms',
    
    // Motion tokens
    LOCAL_MOTION_LINEAR: 'cubic-bezier(0, 0, 1, 1)',
    LOCAL_MOTION_EASE: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    LOCAL_MOTION_EASE_OUT: 'cubic-bezier(.165, .84, .44, 1)',
    LOCAL_MOTION_EASE_IN_OUT: 'cubic-bezier(.455, .03, .515, .955)',
    LOCAL_MOTION_SPRING: 'cubic-bezier(0.32, 1.72, 0, 1)'
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
        import('./component/tokenUtils').then(module => {
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
    setTokenValues(prev => ({
      ...prev,
      [tokenName]: e.target.value
    }));
  };

  return (
    <>
      <div className="tokens-configurator">
        <h3>Настройка токенов анимации</h3>
        
        <div className="tokens-section">
          <h4>Токены длительности</h4>
          
          {Object.entries(tokenValues)
            .filter(([key]) => key.startsWith('LOCAL_DURATION'))
            .map(([tokenName, tokenValue]) => (
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
          <h4>Токены движения</h4>
          
          {Object.entries(tokenValues)
            .filter(([key]) => key.startsWith('LOCAL_MOTION'))
            .map(([tokenName, tokenValue]) => (
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
      </div>
      
      <ErrorBoundary>
        <Slider customTokens={tokenValues} />
      </ErrorBoundary>
      
      <div className="token-preview">
        <h4>Предпросмотр анимации</h4>
        <div className="preview-boxes">
          {Object.entries(tokenValues)
            .filter(([key]) => key.startsWith('LOCAL_DURATION'))
            .map(([durationKey, durationValue]) => (
              Object.entries(tokenValues)
                .filter(([key]) => key.startsWith('LOCAL_MOTION'))
                .map(([motionKey, motionValue]) => (
                  <div key={`${durationKey}-${motionKey}`} className="preview-item">
                    <div 
                      className="preview-box" 
                      style={{
                        transition: `all ${durationValue} ${motionValue}`
                      }}
                    ></div>
                    <div className="preview-label">
                      <div>{durationKey}</div>
                      <div>{motionKey}</div>
                    </div>
                  </div>
                )).slice(0, 1)  // Ограничиваем количество примеров
            ))
          }
        </div>
        <p>Наведите курсор на блоки для просмотра анимации</p>
        
        <div className="token-values">
          <p><strong>Текущие значения токенов:</strong></p>
          {Object.entries(tokenValues).map(([key, value]) => (
            <div key={key} className="token-value-item">
              <code>{key}: {value}</code>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
