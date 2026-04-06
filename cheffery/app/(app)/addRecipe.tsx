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

// ⭐ Star Rating Component
type StarRatingProps = {
  rating: number;
  setRating: (value: number) => void;
};

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text
            style={{
              fontSize: 28,
              marginRight: 6,
              color: star <= rating ? "#FFD700" : "#999",
            }}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

type Ingredient = {
  quantity: string;
  unit: string;
  name: string;
};

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [cookTime, setCookTime] = useState("");
  const [prepTime, setPrepTime] = useState("");

  // ⭐ Two custom dropdowns
  const [mealType, setMealType] = useState("");
  const [showMealMenu, setShowMealMenu] = useState(false);

  const [cuisineType, setCuisineType] = useState("");
  const [showCuisineMenu, setShowCuisineMenu] = useState(false);

  const [tasteRating, setTasteRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);

  // ⭐ Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [name, setName] = useState("");

  // ⭐ Steps
  const [steps, setSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState("");

  const saveRecipe = () => {
    const recipe = {
      id: Date.now().toString(),
      title,
      description,
      cookTime,
      prepTime,
      mealType,
      cuisineType,
      ingredients,
      steps,
      tasteRating,
      difficultyRating,
    };

    console.log("Saving recipe:", recipe);
  };

  const mealOptions = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Drink",
  ];

  const cuisineOptions = [
    "Mexican",
    "Italian",
    "Greek",
    "Chinese",
    "Japanese",
    "Indian",
    "BBQ",
    "Seafood",
  ];

  const addIngredient = () => {
    if (!quantity || !unit || !name) return;
    setIngredients((prev) => [...prev, { quantity, unit, name }]);
    setQuantity("");
    setUnit("");
    setName("");
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (!newStep) return;
    setSteps((prev) => [...prev, newStep]);
    setNewStep("");
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Add Recipe</Text>

        {/* Title */}
        <TextInput
          style={styles.input}
          placeholder="Recipe Title"
          placeholderTextColor="#333"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Short Description"
          placeholderTextColor="#333"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Cook Time */}
        <TextInput
          style={styles.input}
          placeholder="Cook Time (e.g., 30 min)"
          placeholderTextColor="#333"
          value={cookTime}
          onChangeText={setCookTime}
        />

        {/* Prep Time */}
        <TextInput
          style={styles.input}
          placeholder="Prep Time (e.g., 15 min)"
          placeholderTextColor="#333"
          value={prepTime}
          onChangeText={setPrepTime}
        />

        {/* ⭐ Meal Type Dropdown */}
        <Text style={styles.sectionTitle}>Meal Type</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowMealMenu(!showMealMenu)}
        >
          <Text style={mealType ? styles.dropdownText : styles.dropdownPlaceholder}>
            {mealType || "Select meal type"}
          </Text>
        </TouchableOpacity>

        {showMealMenu && (
          <View style={styles.dropdownMenu}>
            {mealOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setMealType(item);
                  setShowMealMenu(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ⭐ Cuisine Type Dropdown */}
        <Text style={styles.sectionTitle}>Cuisine Type</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowCuisineMenu(!showCuisineMenu)}
        >
          <Text
            style={
              cuisineType ? styles.dropdownText : styles.dropdownPlaceholder
            }
          >
            {cuisineType || "Select cuisine type"}
          </Text>
        </TouchableOpacity>

        {showCuisineMenu && (
          <View style={styles.dropdownMenu}>
            {cuisineOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.dropdownItem}
                onPress={() => {
                  setCuisineType(item);
                  setShowCuisineMenu(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ⭐ Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.smallInput}
            placeholder="Qty"
            placeholderTextColor="#333"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            style={styles.smallInput}
            placeholder="Unit"
            placeholderTextColor="#333"
            value={unit}
            onChangeText={setUnit}
          />
          <TextInput
            style={styles.flexInput}
            placeholder="Ingredient"
            placeholderTextColor="#333"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {ingredients.map((ing, index) => (
          <View key={index} style={styles.listRow}>
            <Text>
              {ing.quantity} {ing.unit} {ing.name}
            </Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.delete}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ⭐ Steps */}
        <Text style={styles.sectionTitle}>Steps</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.flexInput}
            placeholder="Add a step"
            placeholderTextColor="#333"
            value={newStep}
            onChangeText={setNewStep}
          />
          <TouchableOpacity style={styles.addButton} onPress={addStep}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {steps.map((step, index) => (
          <View key={index} style={styles.listRow}>
            <Text>
              {index + 1}. {step}
            </Text>
            <TouchableOpacity onPress={() => removeStep(index)}>
              <Text style={styles.delete}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ⭐ Ratings Row */}
        <View style={styles.ratingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Taste</Text>
            <StarRating rating={tasteRating} setRating={setTasteRating} />
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.sectionTitle}>Difficulty</Text>
            <StarRating
              rating={difficultyRating}
              setRating={setDifficultyRating}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#333",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },

  // ⭐ Custom Dropdown Styles
  dropdown: {
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#e6e6e6",
    marginBottom: 6,
  },
  dropdownText: {
    color: "#000",
    fontSize: 16,
  },
  dropdownPlaceholder: {
    color: "#777",
    fontSize: 16,
  },
  dropdownMenu: {
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  dropdownItemText: {
    color: "#000",
    fontSize: 16,
  },

  // ⭐ Ingredients + Steps
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  smallInput: {
    width: 60,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#333",
    color: "#000",
  },
  flexInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#333",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  delete: {
    color: "red",
    fontWeight: "bold",
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  saveButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
