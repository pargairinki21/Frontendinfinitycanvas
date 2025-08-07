import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import App from './App.jsx'
import Login from './components/auth/Login.jsx';
import './index.css'

// Wrapper to handle navigation after login
function LoginWithRedirect() {
  const navigate = useNavigate();
  return <Login onLogin={() => navigate('/canvas')} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWithRedirect />} />
        <Route path="/canvas" element={<App />} />
        <Route path="*" element={<LoginWithRedirect />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)