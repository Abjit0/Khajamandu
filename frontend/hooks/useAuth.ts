import { useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authAPI } from '../api/client';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return; // Still loading

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthScreen = ['index', 'signup', 'otp-verification', 'reset-password'].includes(segments[0] || '');

    if (!isAuthenticated && !isAuthScreen) {
      // User is not authenticated and trying to access protected route
      router.replace('/');
    } else if (isAuthenticated && isAuthScreen) {
      // User is authenticated and on auth screen, redirect to home
      router.replace('/home');
    }
  }, [isAuthenticated, segments]);

  const checkAuthStatus = async () => {
    try {
      const { token, userData } = await authAPI.getAuthData();
      if (token && userData) {
        setIsAuthenticated(true);
        setUserData(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  const login = async (token: string, user: any) => {
    await authAPI.storeAuthData(token, user);
    setIsAuthenticated(true);
    setUserData(user);
  };

  const logout = async () => {
    await authAPI.clearAuthData();
    setIsAuthenticated(false);
    setUserData(null);
    router.replace('/');
  };

  return {
    isAuthenticated,
    userData,
    login,
    logout,
    checkAuthStatus
  };
}