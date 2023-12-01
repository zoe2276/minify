import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// component exports:
export { Button } from "./components/Button"
export { Loading } from "./components/Loading"
export { LoginScreen } from "./components/LoginScreen"
export { Player } from "./components/Player"
export { Refresh } from "./components/Refresh"
export { SidebarMenu } from "./components/SidebarMenu"
// function exports:
export { apiCall } from "./components/_apiCall"