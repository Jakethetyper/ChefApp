import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Recipe() {
  const { theme } = useAuth();
  const styles = createStyles(theme);

  // 🔥 Mock data (replace with route params / API)
  const recipe = {
    title: "Spicy Chicken Tacos",
    description: "Delicious tacos packed with flavor and spice.",
    prepTime: "15",
    cookTime: "20",
    cuisine: "Mexican",
    categories: ["Dinner", "Entree"],
    ingredients: [
      { quantity: "2", unit: "lb", ingredient: "chicken" },
      { quantity: "1", unit: "tbsp", ingredient: "chili powder" },
      { quantity: "6", unit: "", ingredient: "tortillas" },
    ],
    instructions: [
      "Season the chicken with spices.",
      "Cook chicken in a pan until done.",
      "Warm tortillas and assemble tacos.",
    ],
    tasteRating: 4,
    difficultyRating: 2,
    chefName: "Jake",
  };

  const totalTime =
    (recipe.prepTime ? Number(recipe.prepTime) : 0) +
    (recipe.cookTime ? Number(recipe.cookTime) : 0);

  const addToShoppingList = () => {
    console.log("Add ingredients to shopping list");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.description && (
          <Text style={styles.description}>{recipe.description}</Text>
        )}

        {/* Tags */}
        <View style={styles.tagContainer}>
          {recipe.cuisine && (
            <View style={styles.tagPrimary}>
              <Text style={styles.tagText}>{recipe.cuisine}</Text>
            </View>
          )}

          {recipe.categories?.map((cat, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{cat}</Text>
            </View>
          ))}
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>⏱ {totalTime} min</Text>
          <Text style={styles.meta}>👨‍🍳 {recipe.chefName}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.rating}>⭐ {recipe.tasteRating}</Text>
          <Text style={styles.difficulty}>⚙️ {recipe.difficultyRating}</Text>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>

        <View style={styles.card}>
          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={styles.listText}>
              • {ing.quantity} {ing.unit} {ing.ingredient}
            </Text>
          ))}
        </View>

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions</Text>

        <View style={styles.card}>
          {recipe.instructions.map((step, i) => (
            <Text key={i} style={styles.stepText}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* 🔥 Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={addToShoppingList}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>🛒 Add to Shopping List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6,
    },

    description: {
      color: theme.textSecondary,
      marginBottom: 10,
      lineHeight: 18,
    },

    tagContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 10,
    },

    tagPrimary: {
      backgroundColor: theme.primary + "20",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    tag: {
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

    metaRow: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 8,
    },

    meta: {
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

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },

    card: {
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },

    listText: {
      color: theme.text,
      marginBottom: 6,
    },

    stepText: {
      color: theme.text,
      marginBottom: 10,
      lineHeight: 18,
    },

    fab: {
      position: "absolute",
      bottom: 20,
      left: 16,
      right: 16,
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { height: 4, width: 0 },
      shadowRadius: 6,
      elevation: 5,
    },

    fabText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });
