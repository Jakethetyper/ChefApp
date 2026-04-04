import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // If already logged in, send them to the app
  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
