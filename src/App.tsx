
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Family from './pages/Family';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import RegistrationPending from './pages/RegistrationPending';
import Volunteers from './pages/Volunteers';

import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/family" element={<Family />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/registration-pending" element={<RegistrationPending />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
