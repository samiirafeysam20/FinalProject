import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ username, password });
      console.log('Login API response:', response);
      // Handle both {token, user} and flat {token, id, username, role} responses
      if (response && response.token) {
        let userObj = response.user;
        if (!userObj && response.username) {
          userObj = {
            id: response.id,
            username: response.username,
            role: response.role,
            email: response.email,
            firstName: response.firstName || response.first_name,
            lastName: response.lastName || response.last_name,
          };
        }
        if (userObj) {
          setUser(userObj);
          localStorage.setItem('user', JSON.stringify(userObj));
          localStorage.setItem('token', response.token);
          setLoading(false);
          return true;
        }
      }
      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};