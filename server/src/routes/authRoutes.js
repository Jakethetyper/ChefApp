const express = require("express");

const { signup, login, me } = require("../controllers/authController");
const {
  addRecipe,
  getRecentRecipes,
} = require("../controllers/recipeController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/me", me);

router.post("/addRecipe", addRecipe);
router.post("/getRecentRecipes", getRecentRecipes);

module.exports = router;
