const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  cleanInstructions: {
    type: String,
  },
  cookMethods: [
    {
      type: String,
    },
  ],
  perishTime: { type: String },
  perishMethods: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
