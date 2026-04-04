import { useAuth } from "@/context/AuthContext";
import { Redirect, Tabs } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Tabs.Screen
        name="search"
        options={{ headerShown: false, title: "Search" }}
      />
      <Tabs.Screen
        name="addRecipe"
        options={{ headerShown: false, title: "Publish" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ headerShown: false, title: "Profile" }}
      />
    </Tabs>
  );
}
