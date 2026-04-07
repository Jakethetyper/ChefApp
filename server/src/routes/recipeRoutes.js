const express = require("express");
const router = express.Router();

const {
  addRecipe,
  getRecentRecipes,
  searchRecipes,
} = require("../controllers/recipeController");

// Add recipe
router.post("/add", addRecipe);

// Get recent recipes
router.get("/recent", getRecentRecipes);

// Search recipes by name
router.get("/search", searchRecipes);

module.exports = router;
