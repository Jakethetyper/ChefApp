import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type RatingsData = {
  ratingsAmount: number;
  ratingsAveraged: number;
};

type Rating = {
  user: string;
  name: string;
  comment: string;
  rating: number;
};

type Recipe = {
  _id: string;
  title: string;
  description?: string;
  cuisine?: string;
  categories?: string[];
  prepTime?: string;
  cookTime?: string;
  ingredients?: { ingredient: string }[];
  tasteRating?: number;
  difficultyRating?: number;
  chefName?: string;
  avgRating: RatingsData;
  ratings: rating;
};

export default function Home() {
  const { BACKEND_URL, theme } = useAuth();
  const styles = createStyles(theme);

  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
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

    getRecentlyUploaded();
  }, []);

  const renderItem = ({ item }: { item: Recipe }) => {
    const totalTime =
      (item.prepTime ? Number(item.prepTime) : 0) +
      (item.cookTime ? Number(item.cookTime) : 0);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.replace({
            pathname: "/search/recipe",
            params: { data: JSON.stringify(item) },
          })
        }
      >
        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Description */}
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* Tags */}
        <View style={styles.tagContainer}>
          {item.cuisine && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.cuisine}</Text>
            </View>
          )}

          {item.categories?.map((cat, i) => (
            <View key={i} style={styles.tagSecondary}>
              <Text style={styles.tagText}>{cat}</Text>
            </View>
          ))}
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          {totalTime > 0 && (
            <Text style={styles.infoText}>⏱ {totalTime} min</Text>
          )}

          {item.ingredients?.length ? (
            <Text style={styles.infoText}>
              🥕 {item.ingredients.length} ingredients
            </Text>
          ) : null}
        </View>

        {/* Ratings */}
        <View style={styles.infoRow}>
          {item.tasteRating && (
            <Text style={styles.rating}>⭐ {item.tasteRating}</Text>
          )}

          {item.difficultyRating && (
            <Text style={styles.difficulty}>⚙️ {item.difficultyRating}</Text>
          )}
        </View>

        {/* Chef */}
        {item.chefName && <Text style={styles.chef}>By {item.chefName}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>🍳 Recent Recipes</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : recentRecipes.length > 0 ? (
          <FlatList
            data={recentRecipes}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
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

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 8,
      backgroundColor: theme.background,
    },

    header: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 16,
      color: theme.text,
    },

    list: {
      paddingBottom: 20,
      gap: 8,
    },

    card: {
      backgroundColor: theme.card,
      padding: 16,
      margin: 4,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowOffset: { height: 4, width: 0 },
      shadowRadius: 6,
      elevation: 3,
    },

    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
    },

    description: {
      color: theme.textSecondary,
      marginTop: 6,
      lineHeight: 18,
    },

    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
    },

    tag: {
      backgroundColor: theme.primary + "20",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    tagSecondary: {
      backgroundColor: theme.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    tagText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: "500",
    },

    infoRow: {
      flexDirection: "row",
      gap: 16,
      marginTop: 10,
    },

    infoText: {
      fontSize: 13,
      color: theme.textSecondary,
    },

    rating: {
      fontSize: 14,
      color: theme.rating,
      fontWeight: "600",
    },

    difficulty: {
      fontSize: 14,
      color: theme.warning,
      fontWeight: "600",
    },

    chef: {
      marginTop: 10,
      fontSize: 12,
      color: theme.textMuted,
    },

    emptyText: {
      textAlign: "center",
      marginTop: 60,
      color: theme.textMuted,
      fontSize: 14,
    },
  });
