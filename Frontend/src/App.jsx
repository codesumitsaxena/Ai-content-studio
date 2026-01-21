import React, { useState } from 'react';
import AIContentStudio from './Components/AIContentStudio';
import LoginPage from './Components/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      {isAuthenticated ? (
        <AIContentStudio />
      ) : (
        <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
