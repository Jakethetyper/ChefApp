import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

type Ingredient = {
  quantity: string;
  unit: string;
  ingredient: string;
};

type Recipe = {
  recipe: string;
  recipeId: string;
};

type GroceryList = {
  ingredients: Ingredient[];
  seasonings: string[];
  recipes: Recipe[];
};

export default function GroceriesScreen() {
  const { theme, userInfo, BACKEND_URL, updateUser } = useAuth();

  const [newIngredient, setNewIngredient] = useState("");

  const groceryList: GroceryList | null = userInfo?.groceryList || {
    ingredients: [],
    seasonings: [],
    recipes: [],
  };

  const [search, setSearch] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const filteredIngredients = useMemo(() => {
    return groceryList?.ingredients.filter((item) =>
      item.ingredient.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, groceryList?.ingredients]);

  const toggleChecked = (name: string) => {
    if (checkedItems.includes(name)) {
      setCheckedItems(checkedItems.filter((item) => item !== name));
    } else {
      setCheckedItems([...checkedItems, name]);
    }
  };

  const progress =
    groceryList?.ingredients.length === 0
      ? 0
      : Math.round(
          (checkedItems.length / groceryList?.ingredients.length) * 100,
        );

  const styles = createStyles(theme);

  const handleGroceryEdits = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/removeGroceryItems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userInfo?.userName,
          removeItems: checkedItems,
        }),
      });

      const result = await response.json();
      updateUser(result.groceries);
    } catch (error) {
      console.log(error);
    }
  };

  const addGroceries = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/addIngredient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient: newIngredient,
          userName: userInfo?.userName,
        }),
      });
      setNewIngredient("");

      const data = await response.json();

      updateUser(data.addIngredientToUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🛒 Grocery List</Text>
          <Text style={styles.subtitle}>Everything needed for your meals</Text>
        </View>
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="Add Ingredient"
          style={styles.input}
          placeholderTextColor={theme.textMuted}
          value={newIngredient}
          onChangeText={setNewIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={addGroceries}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Shopping Progress</Text>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.progressText}>{progress}% picked up</Text>
      </View>

      {/* Ingredients */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ingredients</Text>

        {filteredIngredients?.map((item, index) => {
          const checked = checkedItems.includes(item.ingredient);

          return (
            <TouchableOpacity
              key={index}
              style={styles.ingredientRow}
              onPress={() => toggleChecked(item.ingredient)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  checked && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
              >
                {checked && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.ingredientName, checked && styles.checkedText]}
                >
                  {item.ingredient}
                </Text>

                <Text style={styles.ingredientMeta}>
                  {item.quantity} {item.unit}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recipes */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recipes</Text>

        {groceryList?.recipes.map((recipe, index) => (
          <TouchableOpacity
            onPress={() => {
              router.replace({
                pathname: "/search/recipe",
                params: { recipeTitle: JSON.stringify(recipe) },
              });
            }}
            key={index}
            style={styles.recipeRow}
          >
            <Ionicons name="book-outline" size={18} color={theme.primary} />
            <Text style={styles.recipeText}>{recipe.recipe}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleGroceryEdits()}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },

    header: {
      marginTop: 20,
      marginBottom: 20,
    },

    title: {
      fontSize: 30,
      fontWeight: "700",
      color: theme.text,
    },

    subtitle: {
      marginTop: 4,
      fontSize: 15,
      color: theme.textSecondary,
    },

    searchBox: {
      backgroundColor: theme.card,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 14,
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderRadius: 10,
    },

    addButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 16,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 14,
    },

    ingredientRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    ingredientName: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "600",
    },

    ingredientMeta: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },

    checkedText: {
      textDecorationLine: "line-through",
      opacity: 0.5,
    },

    recipeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 10,
    },

    recipeText: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "500",
    },

    tagsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    tag: {
      backgroundColor: theme.surface,
      borderRadius: 30,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },

    tagText: {
      color: theme.text,
      fontSize: 14,
    },

    progressBarBg: {
      height: 10,
      borderRadius: 20,
      backgroundColor: theme.border,
      overflow: "hidden",
    },

    progressBarFill: {
      height: "100%",
      backgroundColor: theme.primary,
      borderRadius: 20,
    },

    progressText: {
      marginTop: 10,
      color: theme.textSecondary,
      fontSize: 14,
    },

    fab: {
      backgroundColor: theme.success,
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
