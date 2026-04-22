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
  instructions: [
    {
      type: String,
      required: true,
    },
  ],
  cuisine: {
    type: String,
    enum: [
      "Italian",
      "Mexican",
      "American",
      "Asian",
      "Indian",
      "Chinese",
      "BBQ",
      "Seafood",
    ],
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
        "Drink",
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
  avgRating: {
    ratingsAmount: {
      type: Number,
    },
    ratingsAveraged: {
      type: Number,
    },
  },
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
