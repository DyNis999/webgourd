import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Import App component
import 'bootstrap/dist/css/bootstrap.min.css';
import { socket } from './socket/index';  // Import socket

function AppWrapper() {
  useEffect(() => {
    socket.connect();  // Connect the socket when the app starts
  }, []);  // Empty dependency array ensures it runs only once

  return (
    <div className="AppWrapper">
      <App />  {/* Call the App component */}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />  {/* Use the renamed AppWrapper */}
  </React.StrictMode>
);
