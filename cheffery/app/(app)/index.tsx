import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function Home() {
  const { BACKEND_URL } = useAuth();

  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentlyUploaded = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/getRecentRecipes`, {
          method: "POST",
        });

        const data = await res.json();
        setRecentRecipes(data.recentRecipes || []);
      } catch (error) {
        console.log("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    getRecentlyUploaded(); // ✅ correctly called
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Recent Recipes</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : recentRecipes.length > 0 ? (
          <FlatList
            data={recentRecipes}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>
            No recipes yet. Be the first to add one!
          </Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  list: {
    gap: 12,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "gray",
  },
});
