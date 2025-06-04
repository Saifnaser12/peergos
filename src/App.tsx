import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createTheme } from './theme';

// Simple component for testing
function SimpleHome() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Tax System</h1>
      <p>Application is loading successfully!</p>
    </div>
  );
}

function App() {
  const theme = createTheme('ltr');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<SimpleHome />} />
            <Route path="*" element={<SimpleHome />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;