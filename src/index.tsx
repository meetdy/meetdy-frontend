import './index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistOptions, PersistQueryClientProvider, queryClient } from "@/queries/core";

import App from './routes';

import store from '@/redux/store';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        <App />
      </PersistQueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
