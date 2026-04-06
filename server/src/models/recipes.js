const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  prepTime: {
    type: String,
  },
  cookTime: {
    type: String,
  },
  ingredients: [
    {
      qty: {
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
  instructions: [
    {
      step: {
        type: Number,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  cuisine: {
    type: String,
    enum: ["Italian", "Mexican", "American", "Asian", "Indian"],
  },
  categories: [
    {
      type: String,
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Dessert",
        "Snack",
        "Entree",
        "Appetizer",
      ],
    },
  ],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String, required: true },
      comment: {
        type: String,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    req: true,
  },
  chefName: {
    type: String,
    req: true,
  },
  tasteRating: {
    type: Number,
  },
  difficultyRating: {
    type: Number,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
