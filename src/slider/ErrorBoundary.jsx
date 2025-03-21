import { useState, useEffect } from 'react';

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

export default ErrorBoundary; 