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
});

module.exports = mongoose.model("User", userSchema);
