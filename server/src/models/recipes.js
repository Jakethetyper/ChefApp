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
      type: String,
      required: true,
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
  categories: [
    {
      type: String,
    },
  ],
  mealType: [{ type: String }],
  Ratings: [
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
});

module.exports = mongoose.model("Recipe", recipeSchema);
