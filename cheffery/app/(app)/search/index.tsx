import { useAuth } from "@/context/AuthContext";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
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
  ratings: Rating;
};

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function SearchScreen() {
  const { BACKEND_URL, theme } = useAuth();
  const styles = createStyles(theme);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState();
  const [showFilters, setShowFilters] = useState(false);

  const fetchRecipes = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/auth/search?name=${encodeURIComponent(searchTerm)}`,
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => fetchRecipes(text), 400),
    [],
  );

  const handleSearchChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // -----------------------------
  // Render Item
  // -----------------------------
  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/search/recipe",
          params: { data: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.tagContainer}>
        {item.cuisine && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.cuisine}</Text>
          </View>
        )}

        {item.categories?.slice(0, 2).map((cat, i) => (
          <View key={i} style={styles.tagSecondary}>
            <Text style={styles.tagText}>{cat}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search recipes..."
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={handleSearchChange}
        />
        <View>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Ionicons name="filter" size={30} color={theme.primary} />
          </TouchableOpacity>

          {showFilters && <View style={styles.filterMenu}></View>}
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="small"
          color={theme.primary}
          style={{ marginBottom: 10 }}
        />
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text style={styles.noResults}>No recipes found</Text>
          ) : null
        }
      />
    </SafeAreaView>
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
      color: theme.text,
      marginBottom: 16,
    },

    searchWrapper: {
      marginBottom: 16,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    input: {
      backgroundColor: theme.surface,
      padding: 14,
      borderRadius: 14,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      fontSize: 14,
      minWidth: "80%",
    },

    card: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      margin: 4,
      marginTop: 0,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowOffset: { height: 4, width: 0 },
      shadowRadius: 6,
      elevation: 2,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },

    description: {
      marginTop: 6,
      color: theme.textSecondary,
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
    ratingsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
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

    noResults: {
      textAlign: "center",
      marginTop: 40,
      color: theme.textMuted,
      fontSize: 14,
    },
  });
