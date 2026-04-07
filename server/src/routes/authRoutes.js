const express = require("express");

const {
  signup,
  login,
  me,
  getMyself,
} = require("../controllers/authController");

const{
addRecipe,
getRecentRecipes,
searchRecipes,  
} = require("../controllers/recipeController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);
router.post("/getMyself", getMyself);

router.post("/add", addRecipe);

// Get recent recipes
router.post("/getrecentrecipes", getRecentRecipes);

// Search recipes by name
router.get("/search", searchRecipes);

module.exports = router;
