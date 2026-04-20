const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  height: {
    type: String,
  },
  weight: {
    type: Number,
  },
  gender: {
    type: String,
  },
  activity: {
    weekly: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  favoritedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipes",
    },
  ],
  createdRecipes: [
    {
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipes",
      },
      recipeTitle: {
        type: String,
      },
    },
  ],
  groceryList: {
    ingredients: [
      {
        quantity: {
          type: String,
        },
        unit: {
          type: String,
        },
        ingredient: {
          type: String,
        },
      },
    ],
    seasonings: {
      owned: { type: [String], default: [] },
      needed: { type: [String], default: [] },
    },
    recipes: [
      {
        recipe: {
          type: String,
        },
        recipeId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
