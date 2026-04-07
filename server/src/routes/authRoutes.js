const express = require("express");

const { signup, login, me } = require("../controllers/authController");

const {
  addRecipe,
  getRecentRecipes,
  searchRecipes,
} = require("../controllers/recipeController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/me", me);

router.post("/addRecipe", addRecipe);

// Get recent recipes
router.post("/getrecentrecipes", getRecentRecipes);

// Search recipes by name
router.get("/search", searchRecipes);

module.exports = router;
