import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';

const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token') || localStorage.getItem('user'));
};

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  const auth = isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={auth ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={auth ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={auth ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;