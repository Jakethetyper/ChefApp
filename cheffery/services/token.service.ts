import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "secret_key_be_me";

export type TokenPayload = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  exp: number;
  iat: number;
  title: string;
};

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const clearToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const getDecodedToken = async (): Promise<TokenPayload | null> => {
  const token = await getToken();
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
