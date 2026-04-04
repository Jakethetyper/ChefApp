import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { styles as globalStyles } from "../../styles/global.styles";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState();
  const [cookTime, setCookTime] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mealType, setMealType] = useState([]);

  const [addIngredient, setAddIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");

  const handleIngredientAddition = () => {
    const placeholder = [...ingredients];
    placeholder.push(newIngredient);
    setIngredients(placeholder);
    setNewIngredient("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <Text>Add Your Recipe!</Text>
          </View>
          <View>
            <TextInput
              placeholder="Name..."
              value={title}
              onChangeText={(text) => setTitle(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Description..."
              value={description}
              onChangeText={(text) => setDescription(text)}
              style={styles.input}
            />
            <View style={globalStyles.rowContainer}>
              <TextInput
                placeholder="Prep Time..."
                value={prepTime}
                onChangeText={(text) => setPrepTime(text)}
                style={styles.input}
              />
              <TextInput
                placeholder="Cook Time..."
                value={cookTime}
                onChangeText={(text) => setCookTime(text)}
                style={styles.input}
              />
            </View>
            <View style={styles.ingredientsContainer}>
              <Text style={{ fontSize: 20, fontWeight: 500 }}>Ingredients</Text>
              {ingredients.length > 1 ? (
                ingredients?.map((ingredient, index) => (
                  <View key={index}>
                    <Text>- {ingredient}</Text>
                  </View>
                ))
              ) : (
                <View>
                  <Text>No ingredients added</Text>
                </View>
              )}
              {addIngredient ? (
                <View style={[globalStyles.rowContainer, { padding: 10 }]}>
                  <TextInput
                    placeholder="Ingredient..."
                    value={newIngredient}
                    onChangeText={(text) => setNewIngredient(text)}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={styles.submitIngredientBtn}
                    onPress={() => handleIngredientAddition()}
                  >
                    <Text>{">"}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addIngredientBtn}
                  onPress={() => setAddIngredient(true)}
                >
                  <Text>Add New Ingredient</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  ingredientsContainer: {},
  submitIngredientBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 15,
  },
  addIngredientBtn: {
    backgroundColor: "green",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
  },
});
