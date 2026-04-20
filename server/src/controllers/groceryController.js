const User = require("../models/user");
const Recipe = require("../models/recipes");

const { seasoningSet, seasonings } = require("../dataSets/seasonings");

const parseQuantity = (value) => {
  if (value === null || value === undefined) return 0;

  value = value.toString().trim();

  // Mixed number: 1 1/2
  if (value.includes(" ")) {
    const [whole, fraction] = value.split(" ");
    const [num, den] = fraction.split("/");
    return Number(whole) + Number(num) / Number(den);
  }

  // Fraction: 1/2
  if (value.includes("/")) {
    const [num, den] = value.split("/");
    return Number(num) / Number(den);
  }

  return Number(value);
};

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

const decimalToFraction = (num) => {
  if (Number.isInteger(num)) return num.toString();

  const tolerance = 1.0e-6;
  let denominator = 1;

  while (
    Math.abs(Math.round(num * denominator) / denominator - num) > tolerance
  ) {
    denominator++;
  }

  let numerator = Math.round(num * denominator);
  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  if (numerator > denominator) {
    const whole = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;

    if (remainder === 0) return whole.toString();

    return `${whole} ${remainder}/${denominator}`;
  }

  return `${numerator}/${denominator}`;
};

const normalizeUnit = (unit = "") => {
  const u = unit.toLowerCase().trim();

  const map = {
    cup: "cup",
    cups: "cup",

    tbsp: "tbsp",
    tablespoon: "tbsp",
    tablespoons: "tbsp",

    tsp: "tsp",
    teaspoon: "tsp",
    teaspoons: "tsp",

    oz: "oz",
    ounce: "oz",
    ounces: "oz",

    lb: "lb",
    lbs: "lb",
    pound: "lb",
    pounds: "lb",

    g: "g",
    gram: "g",
    grams: "g",

    kg: "kg",
    kilogram: "kg",
    kilograms: "kg",

    count: "count",
    item: "count",
    items: "count",
  };

  return map[u] || u;
};

const normalizeIngredient = (name = "") => name.toLowerCase().trim();

const mergeIngredient = (existing, incoming) => {
  const unit1 = normalizeUnit(existing.unit);
  const unit2 = normalizeUnit(incoming.unit);

  // Only combine if same unit
  if (unit1 === unit2) {
    const total =
      parseQuantity(existing.quantity) + parseQuantity(incoming.quantity);

    return {
      ...existing,
      quantity: decimalToFraction(total),
      unit: unit1,
    };
  }

  // Different units -> keep separate entry
  return null;
};

const addGroceries = async (req, res) => {
  try {
    const { ingredients = [], userName, recipeName, recipeId } = req.body;

    const userToChange = await User.findOne({ userName });

    if (!userToChange) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const groceryList = userToChange.groceryList?.ingredients || [];

    const updatedGroceries = [...groceryList];

    for (const incoming of ingredients) {
      const incomingName = normalizeIngredient(incoming.ingredient);

      const seasoningCheck = incoming.toLowerCase().replace(/\s+/g, "");

      const existingIndex = updatedGroceries.findIndex(
        (item) =>
          normalizeIngredient(item.ingredient) === incomingName &&
          normalizeUnit(item.unit) === normalizeUnit(incoming.unit),
      );

      if (existingIndex !== -1) {
        updatedGroceries[existingIndex] = mergeIngredient(
          updatedGroceries[existingIndex],
          incoming,
        );
      } else {
        updatedGroceries.push({
          ...incoming,
          quantity: decimalToFraction(parseQuantity(incoming.quantity)),
          unit: normalizeUnit(incoming.unit),
        });
      }
    }

    userToChange.groceryList.ingredients = updatedGroceries;
    userToChange.groceryList.recipes.push({ recipe: recipeName, recipeId });

    await userToChange.save();

    return res.status(200).json({
      message: "success",
      groceries: updatedGroceries,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error Adding Grocery List",
      error,
    });
  }
};

const removeGroceryItems = async (req, res) => {
  try {
    const { userName, removeItems } = req.body;

    const userToChange = await User.findOne({ userName });

    if (!userToChange) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let updatedIngredients = userToChange.groceryList.ingredients;

    for (const removeItem of removeItems) {
      const removeItemName = normalizeIngredient(removeItem);

      updatedIngredients = updatedIngredients.filter(
        (item) => normalizeIngredient(item.ingredient) !== removeItemName,
      );
    }

    userToChange.groceryList.ingredients = updatedIngredients;

    await userToChange.save();

    return res.status(200).json({
      message: "Items removed",
      groceries: updatedIngredients,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error Removing Grocery items",
      error,
    });
  }
};

const addSeasoning = async (req, res) => {
  try {
    const { newIngredient, seasoningActive, userName } = req.body;

    const userData = await User.findOne({ userName });

    if (!seasoningActive) {
      userData.groceryList.ingredients.push({ ingredient: newIngredient });
      userData.groceryList.seasonings.needed.push(newIngredient);
    } else {
      userData.groceryList.seasonings.owned.push(newIngredient);
    }

    await userData.save();

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding Seasoning", error });
  }
};

module.exports = {
  addGroceries,
  removeGroceryItems,
  addSeasoning,
};
