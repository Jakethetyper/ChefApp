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

  const renderItem = ({ item }) => {
    const totalTime =
      (item.prepTime ? Number(item.prepTime) : 0) +
      (item.cookTime ? Number(item.cookTime) : 0);

    return (
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Description */}
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* Meta Row */}
        <View style={styles.metaRow}>
          {item.cuisine && <Text style={styles.meta}>{item.cuisine}</Text>}

          {item.categories?.length > 0 && (
            <Text style={styles.meta}>{item.categories.join(", ")}</Text>
          )}
        </View>

        {/* Time + Ingredients */}
        <View style={styles.metaRow}>
          {totalTime > 0 && <Text style={styles.meta}>⏱ {totalTime} min</Text>}

          {item.ingredients?.length > 0 && (
            <Text style={styles.meta}>
              🥕 {item.ingredients.length} ingredients
            </Text>
          )}
        </View>

        {/* Ratings */}
        <View style={styles.metaRow}>
          {item.tasteRating && (
            <Text style={styles.meta}>⭐ Taste: {item.tasteRating}</Text>
          )}

          {item.difficultyRating && (
            <Text style={styles.meta}>
              ⚙️ Difficulty: {item.difficultyRating}
            </Text>
          )}
        </View>

        {/* Chef */}
        {item.chefName && <Text style={styles.chef}>By {item.chefName}</Text>}
      </View>
    );
  };

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
    shadowOffset: { height: 2, width: 2 },
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
  description: {
    color: "#555",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  meta: {
    fontSize: 12,
    color: "#777",
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  chef: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },
});
