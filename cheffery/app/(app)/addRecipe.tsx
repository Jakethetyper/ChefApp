import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⭐ Star Rating
const StarRating = ({ rating, setRating, theme }: any) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text
            style={{
              fontSize: 26,
              marginRight: 6,
              color: star <= rating ? theme.rating : theme.textMuted,
            }}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AddRecipe() {
  const { BACKEND_URL, userInfo, theme } = useAuth();
  const styles = createStyles(theme);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [prepTime, setPrepTime] = useState("");

  const [mealType, setMealType] = useState("");
  const [showMealMenu, setShowMealMenu] = useState(false);

  const [cuisineType, setCuisineType] = useState("");
  const [showCuisineMenu, setShowCuisineMenu] = useState(false);

  const [tasteRating, setTasteRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);

  const [ingredients, setIngredients] = useState<any[]>([]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [ingredient, setIngredient] = useState("");

  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState("");

  const saveRecipe = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/addRecipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          prepTime,
          cookTime,
          ingredients,
          instructions: steps,
          cuisine: cuisineType,
          tasteRating,
          difficultyRating,
          userId: userInfo?.userId,
          user: userInfo?.userName,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addIngredient = () => {
    if (!quantity || !ingredient) return;
    setIngredients((prev) => [...prev, { quantity, unit, ingredient }]);
    setQuantity("");
    setUnit("");
    setIngredient("");
  };

  const addStep = () => {
    if (!newStep) return;
    setSteps((prev) => [...prev, newStep]);
    setNewStep("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>🍳 Add Recipe</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Recipe Title"
          placeholderTextColor={theme.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor={theme.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.row}>
          <TextInput
            style={styles.halfInput}
            placeholder="Prep Time"
            placeholderTextColor={theme.textMuted}
            value={prepTime}
            onChangeText={setPrepTime}
          />
          <TextInput
            style={styles.halfInput}
            placeholder="Cook Time"
            placeholderTextColor={theme.textMuted}
            value={cookTime}
            onChangeText={setCookTime}
          />
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.smallInput}
            placeholder="Qty"
            placeholderTextColor={theme.textMuted}
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            style={styles.smallInput}
            placeholder="Unit"
            placeholderTextColor={theme.textMuted}
            value={unit}
            onChangeText={setUnit}
          />
          <TextInput
            style={styles.flexInput}
            placeholder="Ingredient"
            placeholderTextColor={theme.textMuted}
            value={ingredient}
            onChangeText={setIngredient}
          />
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {ingredients.map((ing, i) => (
          <View key={i} style={styles.listRow}>
            <Text style={styles.listText}>
              {ing.quantity} {ing.unit} {ing.ingredient}
            </Text>
          </View>
        ))}

        {/* Steps */}
        <Text style={styles.sectionTitle}>Steps</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.flexInput}
            placeholder="Add a step"
            placeholderTextColor={theme.textMuted}
            value={newStep}
            onChangeText={setNewStep}
          />
          <TouchableOpacity style={styles.addButton} onPress={addStep}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {steps.map((step, i) => (
          <Text key={i} style={styles.listText}>
            {i + 1}. {step}
          </Text>
        ))}

        {/* Ratings */}
        <View style={styles.ratingRow}>
          <View>
            <Text style={styles.sectionTitle}>Taste</Text>
            <StarRating
              rating={tasteRating}
              setRating={setTasteRating}
              theme={theme}
            />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Difficulty</Text>
            <StarRating
              rating={difficultyRating}
              setRating={setDifficultyRating}
              theme={theme}
            />
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
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

    header: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 16,
    },

    input: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },

    textArea: {
      height: 90,
    },

    row: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },

    halfInput: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },

    smallInput: {
      width: 60,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },

    flexInput: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      color: theme.text,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginTop: 10,
      marginBottom: 6,
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

    listRow: {
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },

    listText: {
      color: theme.text,
    },

    ratingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },

    saveButton: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 14,
      marginTop: 30,
      marginBottom: 40,
    },

    saveButtonText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "600",
    },
  });
