import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Simple, reliable API URL configuration
const getApiUrl = () => {
    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api';
    }
    
    // For mobile - Use current Wi-Fi IP
    return 'http://192.168.101.7:5000/api';
};

const API_URL = getApiUrl();

console.log('🔗 Platform:', Platform.OS);
console.log('🔗 API URL:', API_URL);

export const client = axios.create({
    baseURL: API_URL,
    timeout: 20000, // Increased timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
client.interceptors.request.use(
    async (config) => {
        console.log('📤 Making request to:', config.baseURL + config.url);
        console.log('📤 Request data:', config.data);
        
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log('Error getting auth token:', error);
        }
        return config;
    },
    (error) => {
        console.log('📤 Request setup error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
client.interceptors.response.use(
    (response) => {
        console.log('📥 Response received:', response.status, response.data);
        return response;
    },
    async (error) => {
        console.log('📥 Response error details:');
        console.log('  - Message:', error.message);
        console.log('  - Code:', error.code);
        console.log('  - Response status:', error.response?.status);
        console.log('  - Response data:', error.response?.data);
        console.log('  - Config URL:', error.config?.url);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🚨 Connection refused - backend server not running or wrong port');
        } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
            console.log('🚨 Network error - check IP address and firewall');
        } else if (error.code === 'ENOTFOUND') {
            console.log('🚨 Host not found - check IP address');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('🚨 Connection timeout - server too slow or unreachable');
        }
        
        if (error.response?.status === 401) {
            try {
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('userData');
                console.log('Authentication failed, token cleared');
            } catch (storageError) {
                console.log('Error clearing auth data:', storageError);
            }
        }
        return Promise.reject(error);
    }
);

// Helper functions for authentication
export const authAPI = {
    storeAuthData: async (token, userData) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Error storing auth data:', error);
        }
    },

    getAuthData: async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userData = await AsyncStorage.getItem('userData');
            return {
                token,
                userData: userData ? JSON.parse(userData) : null
            };
        } catch (error) {
            console.error('Error getting auth data:', error);
            return { token: null, userData: null };
        }
    },

    clearAuthData: async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    },

    isAuthenticated: async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            return !!token;
        } catch (error) {
            console.error('Error checking auth status:', error);
            return false;
        }
    },

    saveProfileImage: async (imageUri) => {
        try {
            await AsyncStorage.setItem('profileImage', imageUri);
        } catch (error) {
            console.error('Error saving profile image:', error);
            throw error;
        }
    },

    getProfileImage: async () => {
        try {
            const imageUri = await AsyncStorage.getItem('profileImage');
            return imageUri;
        } catch (error) {
            console.error('Error getting profile image:', error);
            return null;
        }
    },

    clearProfileImage: async () => {
        try {
            await AsyncStorage.removeItem('profileImage');
        } catch (error) {
            console.error('Error clearing profile image:', error);
        }
    }
};