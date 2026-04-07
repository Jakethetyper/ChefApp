import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import {
  saveToken,
  getToken,
  clearToken,
  getDecodedToken,
} from "../services/token.service";

type Created = {
  recipeId: string;
  recipeTitle: string;
};

type User = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  height?: string;
  weight?: number;
  gender?: string;
  favoritedRecipes: any[];
  createdRecipes: Created[];
};

type Theme = {
  background: string;
  text: string;
  card: string;
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
  theme: Theme;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = "https://2de8-208-38-228-61.ngrok-free.app";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const lightTheme = {
    background: "#ffffff",
    text: "#000000",
    card: "#f5f5f5",
  };

  const darkTheme = {
    background: "#121212",
    text: "#ffffff",
    card: "#1e1e1e",
  };

  const scheme = useColorScheme();

  const theme = scheme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    const restoreSession = async () => {
      const token = await getToken();
      if (token) {
        const value = await getDecodedToken();
        console.log(value);
        const res = await fetch(`${BACKEND_URL}/auth/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: value?.userId,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.log(text);
          return;
        }

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

      if (!res.ok) {
        const text = await res.text();
        console.log(text);
        return;
      }

      const data = await res.json();
      setUserInfo(data.user);

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

      if (!res.ok) {
        const text = await res.text();
        console.log(text);
        return;
      }
      const data = await res.json();
      setUserInfo(data.user);

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
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        BACKEND_URL,
        userInfo,
        theme,
      }}
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
