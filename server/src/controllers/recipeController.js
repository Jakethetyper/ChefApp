const Recipe = require("../models/recipes");
const user = require("../models/user");
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

    const userToUpdate = await User.findOne({ userName: user });

    if (!userToUpdate.createdRecipes) {
      userToUpdate.createdRecipes = [];
    }

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
      title: { $regex: name, $options: "i" }, // case-insensitive match
    });

    return res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error searching recipes", error });
  }
};

const addReview = async (req, res) => {
  try {
    const { user, name, comment, rating, recipe } = req.body;

    const recipeToChange = await Recipe.findOne({ _id: recipe });
    const ratingsAvg = recipeToChange.avgRating;

    recipeToChange.avgRating.ratingsAveraged =
      (ratingsAvg.ratingsAmount * ratingsAvg.ratingsAveraged + rating) /
      (ratingsAvg.ratingsAmount + 1);

    recipeToChange.ratings.push({ user, name, comment, rating });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding rating", error });
  }
};

module.exports = {
  addRecipe,
  getRecentRecipes,
  searchRecipes,
  addReview,
};
