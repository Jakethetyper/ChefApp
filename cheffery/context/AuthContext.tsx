import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { saveToken, getToken, clearToken } from "../services/token.service";

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  userName: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    password: string,
    userName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  BACKEND_URL: string;
  userInfo: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = "https://cordia-orthomorphic-alane.ngrok-free.dev";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = await getToken();
      if (token) {
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserInfo(data.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await res.json();
      setUserInfo(data.user);

      if (!res.ok) {
        Alert.alert("Login failed", data.message || "Unknown error");
        return;
      }

      // ✅ SAVE TOKEN
      await saveToken(data.token);

      setIsAuthenticated(true);
    } catch (err) {
      console.log(err);
      Alert.alert("Login failed", "Could not connect to backend");
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    password: string,
    userName: string,
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          password,
          userName,
        }),
      });

      const data = await res.json();
      setUserInfo(data.user);

      if (!res.ok) {
        Alert.alert("Signup failed", data.message || "Unknown error");
        return;
      }

      await saveToken(data.token);
      setIsAuthenticated(true);
    } catch (err) {
      console.log(err);
      Alert.alert("Signup failed", "Could not connect to backend");
    }
  };

  const logout = async () => {
    await clearToken();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // or splash screen
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, signup, logout, BACKEND_URL, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
