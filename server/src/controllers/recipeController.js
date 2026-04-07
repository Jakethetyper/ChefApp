const Recipe = require("../models/recipes");
const User = require("../models/user");

const addRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      cookTime,
      prepTime,
      category,
      ingredients,
      instructions,
      cuisine,
      tasteRating,
      difficultyRating,
      user,
      userId,
    } = req.body;

    const newRecipe = new Recipe({
      title,
      description,
      prepTime: prepTime || null,
      cookTime: cookTime || null,
      ingredients,
      instructions,
      cuisine: cuisine || null,
      categories: category || null,
      tasteRating,
      difficultyRating,
      chef: userId,
      chefName: user,
    });

    const savedRecipe = await newRecipe.save();

    const userToUpdate = await User.findById(userId);
console.log(userToUpdate)
    userToUpdate.createdRecipes.push({
      recipeId: savedRecipe._id,
      recipeTitle: savedRecipe.title,
    });

    await userToUpdate.save();

    return res.status(201).json(savedRecipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding recipe", error });
  }
};

const getRecentRecipes = async (req, res) => {
  try {
    const recentRecipes = await Recipe.find().sort({ _id: -1 }).limit(10);

    return res.status(200).json({ recentRecipes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding recipe", error });
  }
};
const searchRecipes = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Search term required" });
    }

    const recipes = await Recipe.find({
      title: { $regex: name, $options: "i" } // case-insensitive match
    });

    return res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error searching recipes", error });
  }
};

module.exports = { addRecipe, getRecentRecipes, searchRecipes };

