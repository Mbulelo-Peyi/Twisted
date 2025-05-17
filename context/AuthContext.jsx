import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();
const baseURL = "http://192.168.8.101:8000";

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const fetchInterval = 1000 * 60 * 10;

  // Store JWT
  const storeTokens = async (tokens) => {
    try {
      const tokenString = JSON.stringify(tokens);
      await SecureStore.setItemAsync('authTokens', tokenString);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error; // Propagate error for handling
    }
  };

  // Retrieve JWT
  const getTokens = async () => {
    try {
      const tokenString = await SecureStore.getItemAsync('authTokens');
      return tokenString ? JSON.parse(tokenString) : null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  };

  // Delete JWT
  const removeTokens = async () => {
    try {
      await SecureStore.deleteItemAsync('authTokens');
    } catch (error) {
      console.error('Error removing tokens:', error);
    }
  };

  const getToken = async () => {
    try {
      const tokens = await getTokens();
      console.log('Retrieved tokens:', tokens);
      if (tokens) {
        setAuthTokens(tokens);
        setUser(jwtDecode(tokens.access));
        // Check if token is expired or needs refresh
        const decoded = jwtDecode(tokens.access);
        if (dayjs().isAfter(dayjs.unix(decoded?.exp))) {
          await updateAuthTokens(tokens);
        }
        setLoading(false);
      } else {
        setAuthTokens(null);
        setUser(null);
        if (loading) {
          setLoading(false);
          navigation.navigate('BottomAuth', { screen: 'Login' });
        }
      }
    } catch (error) {
      console.error('Error in getToken:', error);
      setAuthTokens(null);
      setUser(null);
      if (loading) {
        setLoading(false);
        navigation.navigate('AuthPath', { screen: 'Login' });
      }
    }
  };

  const refreshAuthTokens = async () => {
    console.log('Refreshing tokens');
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/api/token/refresh/`,
        { refresh: authTokens.refresh },
        config
      );
      if (response.status === 200) {
        const newTokens = response.data;
        setAuthTokens(newTokens);
        setUser(jwtDecode(newTokens.access));
        await storeTokens(newTokens);
        console.log('Tokens refreshed:', newTokens);
      } else {
        throw new Error('Refresh failed');
      }
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      logoutUser();
      navigation.navigate('AuthPath', { screen: 'Login' });
    }
    if (loading) {
      setLoading(false);
    }
  };

  const updateAuthTokens = async (tokens) => {
    console.log('Updating tokens');
    if (!tokens?.refresh) {
      logoutUser();
      return;
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/api/token/refresh/`,
        { refresh: tokens.refresh },
        config
      );
      if (response.status === 200) {
        const newTokens = response.data;
        setAuthTokens(newTokens);
        setUser(jwtDecode(newTokens.access));
        await storeTokens(newTokens); 
        console.log('Tokens updated:', newTokens);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating tokens:', error);
      logoutUser();
      navigation.navigate('BottomAuth', { screen: 'Login' });
    }
    if (loading) {
      setLoading(false);
    }
  };

  const SignIn = async (data) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/api/token/`,
        data,
        config
      );
      const newTokens = response.data;
      setAuthTokens(newTokens);
      setUser(jwtDecode(newTokens.access));
      await storeTokens(newTokens);
      console.log('Signed in, tokens stored:', newTokens);
    } catch (error) {
      console.error('Sign-in error:', error.message);
      alert('Something went wrong. Please try again');
      throw error;
    }
  };

  const logoutUser = async () => {
    setAuthTokens(null);
    setUser(null);
    await removeTokens();
    navigation.navigate('AuthPath', { screen: 'Login' });
    console.log('User logged out');
  };

  const reset_password = async (email) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/auth/users/reset_password/`,
        { email },
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const userPasswordStrength = async (email, username, password, setResponse) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/user-passwords/`,
        { email, username, password },
        config
      );
      if (response.status === 200) {
        setResponse(false);
      } else if (response.status === 203) {
        setResponse(true);
      }
    } catch (error) {
      console.error('Error checking password strength:', error);
    }
  };

  const userPasswordNumeric = async (password, setResponse) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${baseURL}/numeric-passwords/`,
        { password },
        config
      );
      if (response.status === 200) {
        setResponse(false);
      } else if (response.status === 203) {
        setResponse(true);
      }
    } catch (error) {
      console.error('Error checking numeric password:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!authTokens && loading) {
        await getToken();
      }
    };
    initializeAuth();

    const interval = setInterval(() => {
      if (authTokens) {
        refreshAuthTokens();
      }
    }, fetchInterval);
    console.log(loading)
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData = {
    user:user,
    setUser:setUser,
    authTokens:authTokens,
    setAuthTokens:setAuthTokens,
    SignIn:SignIn,
    reset_password:reset_password,
    userPasswordStrength:userPasswordStrength,
    userPasswordNumeric:userPasswordNumeric,
    logoutUser:logoutUser,
};

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};