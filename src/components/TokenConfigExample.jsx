import { useState } from 'react';
import TokenConfig from '../slider/TokenConfig';
import './TokenConfigExample.css';

// Example of usage for different components
function TokenConfigExample() {
  // Example tokens for a Button component
  const [buttonTokens, setButtonTokens] = useState({
    BUTTON_HOVER_DURATION: '0.2s',
    BUTTON_HOVER_EASING: 'ease-out',
    BUTTON_PRESS_DURATION: '0.1s',
    BUTTON_PRESS_EASING: 'ease-in',
    ICON_ROTATE_DURATION: '0.3s',
    ICON_ROTATE_EASING: 'ease-in-out'
  });

  // Example tokens for a Modal component
  const [modalTokens, setModalTokens] = useState({
    MODAL_APPEAR_DURATION: '0.3s',
    MODAL_APPEAR_EASING: 'cubic-bezier(0.16, 1, 0.3, 1)',
    MODAL_DISAPPEAR_DURATION: '0.2s',
    MODAL_DISAPPEAR_EASING: 'ease-out',
    BACKDROP_FADE_DURATION: '0.4s',
    BACKDROP_FADE_EASING: 'ease-in'
  });

  // Example tokens for a Slider component (the original use case)
  const [sliderTokens, setSliderTokens] = useState({
    THUMB_MOVE_DURATION: '0.2s',
    THUMB_MOVE_EASING: 'ease-out',
    AXIS_APPEAR_DURATION: '0.3s',
    AXIS_APPEAR_EASING: 'ease-in-out',
    COUNTER_UPDATE_DURATION: '0.15s',
    COUNTER_UPDATE_EASING: 'linear',
    SLIDER_INIT_DURATION: '0.4s',
    SLIDER_INIT_EASING: 'ease-in'
  });

  // Button component token descriptions and translations
  const buttonTokenDescriptions = {
    BUTTON_HOVER_DURATION: 'Длительность наведения',
    BUTTON_HOVER_EASING: 'Плавность наведения',
    BUTTON_PRESS_DURATION: 'Длительность нажатия',
    BUTTON_PRESS_EASING: 'Плавность нажатия',
    ICON_ROTATE_DURATION: 'Длительность вращения иконки',
    ICON_ROTATE_EASING: 'Плавность вращения иконки'
  };

  const buttonComponentNames = {
    'BUTTON': 'Кнопка',
    'ICON': 'Иконка'
  };

  // Modal component token descriptions and translations
  const modalTokenDescriptions = {
    MODAL_APPEAR_DURATION: 'Длительность появления',
    MODAL_APPEAR_EASING: 'Плавность появления',
    MODAL_DISAPPEAR_DURATION: 'Длительность исчезновения',
    MODAL_DISAPPEAR_EASING: 'Плавность исчезновения',
    BACKDROP_FADE_DURATION: 'Длительность затемнения фона',
    BACKDROP_FADE_EASING: 'Плавность затемнения фона'
  };

  const modalComponentNames = {
    'MODAL': 'Модальное окно',
    'BACKDROP': 'Фон'
  };

  // Slider component token descriptions and translations (original)
  const sliderTokenDescriptions = {
    THUMB_MOVE_DURATION: 'Длительность движения ползунка',
    THUMB_MOVE_EASING: 'Плавность движения ползунка',
    AXIS_APPEAR_DURATION: 'Длительность появления оси',
    AXIS_APPEAR_EASING: 'Плавность появления оси',
    COUNTER_UPDATE_DURATION: 'Длительность обновления счетчика',
    COUNTER_UPDATE_EASING: 'Плавность обновления счетчика',
    SLIDER_INIT_DURATION: 'Длительность инициализации',
    SLIDER_INIT_EASING: 'Плавность инициализации'
  };

  const sliderComponentNames = {
    'THUMB': 'Ползунок',
    'AXIS': 'Ось слайдера',
    'COUNTER': 'Счетчик',
    'SLIDER': 'Общие настройки'
  };

  return (
    <div className="token-config-examples">
      <h2>Примеры конфигурации токенов для разных компонентов</h2>
      
      {/* Button Tokens */}
      <div className="example-section">
        <TokenConfig
          tokenValues={buttonTokens}
          onTokenChange={setButtonTokens}
          tokenDescriptions={buttonTokenDescriptions}
          componentNames={buttonComponentNames}
          title="Настройка токенов анимации кнопки"
        />
        <pre className="token-values">
          {JSON.stringify(buttonTokens, null, 2)}
        </pre>
      </div>

      {/* Modal Tokens */}
      <div className="example-section">
        <TokenConfig
          tokenValues={modalTokens}
          onTokenChange={setModalTokens}
          tokenDescriptions={modalTokenDescriptions}
          componentNames={modalComponentNames}
          title="Настройка токенов анимации модального окна"
        />
        <pre className="token-values">
          {JSON.stringify(modalTokens, null, 2)}
        </pre>
      </div>

      {/* Slider Tokens (Original) */}
      <div className="example-section">
        <TokenConfig
          tokenValues={sliderTokens}
          onTokenChange={setSliderTokens}
          tokenDescriptions={sliderTokenDescriptions}
          componentNames={sliderComponentNames}
          title="Настройка токенов анимации слайдера"
        />
        <pre className="token-values">
          {JSON.stringify(sliderTokens, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TokenConfigExample; 