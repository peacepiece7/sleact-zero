import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@layouts/App';

const rootNode = document.querySelector('#app');
if (!rootNode) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootNode).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
