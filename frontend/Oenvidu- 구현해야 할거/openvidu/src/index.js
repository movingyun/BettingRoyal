import React from 'react';
import ReactDOM from 'react-dom/client';                               // javascript component 를 html에 붙이기 위한 dom
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
registerServiceWorker();
