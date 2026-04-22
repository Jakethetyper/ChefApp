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

type WeeklyActions = {
  weekly: string;
  amount: number;
};

type Ingredient = {
  quantity: string;
  unit: string;
  ingredient: string;
};

type recipeHolder = {
  recipe: string;
  recipeId: string;
};

type seasoning = {
  owned: [string];
  needed: [string];
};

type Groceries = {
  ingredients: Ingredient[];
  seasonings: seasoning;
  recipes: recipeHolder[];
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
  activity: WeeklyActions;
  groceryList: Groceries;
};

type Theme = {
  background: string;
  text: string;
  card: string;

  primary: string;
  secondary: string;
  border: string;

  textSecondary: string;
  textMuted: string;

  accent: string;
  success: string;
  warning: string;
  error: string;

  favorite: string;
  rating: string;
  surface: string;
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

const BACKEND_URL = "https://fd6a-208-38-228-61.ngrok-free.app";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const lightTheme = {
    background: "#ffffff",
    text: "#111827",
    card: "#f9fafb",

    primary: "#ea580c", // warm orange (food vibe)
    secondary: "#2563eb",
    border: "#e5e7eb",

    textSecondary: "#6b7280",
    textMuted: "#9ca3af",

    accent: "#f97316", // bright orange
    success: "#16a34a",
    warning: "#f59e0b",
    error: "#dc2626",

    favorite: "#ef4444",
    rating: "#fbbf24",

    surface: "#ffffff",
  };

  const darkTheme = {
    background: "#121212",
    text: "#f9fafb",
    card: "#1e1e1e",

    primary: "#fb923c",
    secondary: "#60a5fa",
    border: "#2a2a2a",

    textSecondary: "#9ca3af",
    textMuted: "#6b7280",

    accent: "#f97316",
    success: "#22c55e",
    warning: "#fbbf24",
    error: "#ef4444",

    favorite: "#f87171",
    rating: "#facc15",

    surface: "#1a1a1a",
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
