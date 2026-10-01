import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../services/authService";

import {
  setToken,
  setUser,
  getToken,
  getUser,
  clearStorage,
} from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(
    getUser()
  );

  const [token, setTokenState] = useState(
    getToken()
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await loginUser({
      email,
      password,
    });

    const receivedToken =
      result?.data?.token ||
      result?.token;

    const receivedUser =
      result?.data?.user ||
      result?.user;

    if (receivedToken) {
      setToken(receivedToken);
      setTokenState(receivedToken);
    }

    if (receivedUser) {
      setUser(receivedUser);
      setUserState(receivedUser);
    }

    return result;
  };

  const register = async (userData) => {
    return await registerUser(userData);
  };

  const logout = () => {
    clearStorage();

    setUserState(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};