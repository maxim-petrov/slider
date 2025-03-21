import { useState, useEffect } from 'react';
import './App.css';
import Slider from './slider/Slider';
import ErrorBoundary from './slider/ErrorBoundary';
import SliderConfig from './slider/SliderConfig';
import { initializeTokenValues } from './slider/utils/tokenInitializer';

function App() {
  // Initialize token values from component tokens
  const [tokenValues, setTokenValues] = useState(initializeTokenValues);

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

  // Handler for token changes from the SliderConfig component
  const handleTokenChange = (newTokenValues) => {
    setTokenValues(newTokenValues);
  };

  return (
    <>
      <ErrorBoundary>
        <Slider customTokens={tokenValues} />
      </ErrorBoundary>
      <SliderConfig onTokenChange={handleTokenChange} tokenValues={tokenValues} />
    </>
  );
}

export default App;