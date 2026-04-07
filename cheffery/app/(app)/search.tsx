import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// -----------------------------
// Types
// -----------------------------
type Recipe = {
  _id: string;
  title: string;
  description?: string;
  cuisine?: string;
  categories?: string[];
};

// -----------------------------
// Custom debounce (React Native safe)
// -----------------------------
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const BACKEND_URL = "http://localhost:5000"; // replace with ngrok when needed

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Search function
  // -----------------------------
  const fetchRecipes = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/recipes/search?name=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Debounced search (400ms)
  // -----------------------------
  const debouncedSearch = useCallback(
    debounce((text: string) => fetchRecipes(text), 400),
    []
  );

  const handleSearchChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  // -----------------------------
  // Render each recipe item
  // -----------------------------
  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <Text style={styles.meta}>
        {item.cuisine ? `${item.cuisine} • ` : ""}
        {item.categories?.[0] ?? ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Recipes</Text>

      <TextInput
        style={styles.input}
        placeholder="Search by recipe name..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={handleSearchChange}
      />

      {loading && <Text style={styles.loading}>Searching...</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <Text style={styles.noResults}>No recipes found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    color: "white",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  loading: {
    color: "#aaa",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    color: "#ccc",
    marginTop: 5,
  },
  meta: {
    color: "#888",
    marginTop: 8,
    fontSize: 12,
  },
  noResults: {
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});
