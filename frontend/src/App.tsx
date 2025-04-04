import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import PrivateRoute from './PrivateRoute';

const App = () => {

  const isAuthenticated = localStorage.getItem('token')

  return (

    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/task" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/task" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>

  );
};

export default App;