
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

try {
  console.log("Starting React render...");
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React render call finished.");
} catch (error) {
  console.error("FATAL RENDER ERROR:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px; background: white; z-index: 9999; position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: auto;">
    <h1>Fatal Render Error</h1>
    <pre>${error.stack || error.message || error}</pre>
  </div>`;
}

window.onerror = function (msg, url, line, col, error) {
  console.error("Window error:", msg, error);
  const errDiv = document.createElement('div');
  errDiv.style = "color: red; padding: 10px; background: #fee; border: 1px solid red; margin: 10px;";
  errDiv.innerHTML = `<strong>Window Error:</strong> ${msg} at ${line}:${col}`;
  document.body.appendChild(errDiv);
};
