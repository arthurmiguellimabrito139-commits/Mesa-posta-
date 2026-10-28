import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { App } from './App.jsx';
import { ProvedorAviso } from './components/Aviso.jsx';
import { ProvedorAuth } from './hooks/useAuth.jsx';
import { GlobalStyle } from './styles/GlobalStyle.js';
import { theme } from './styles/theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <ProvedorAuth>
          <ProvedorAviso>
            <App />
          </ProvedorAviso>
        </ProvedorAuth>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
