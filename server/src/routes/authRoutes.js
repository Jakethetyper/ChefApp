const express = require("express");

const {
  signup,
  login,
  me,
  updateUser,
} = require("../controllers/authController");

const {
  addRecipe,
  getRecentRecipes,
  searchRecipes,
  addReview,
} = require("../controllers/recipeController");

const {
  addGroceries,
  removeGroceryItems,
  addSeasoning,
} = require("../controllers/groceryController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/me", me);
router.post("/updateUser", updateUser);

router.post("/addRecipe", addRecipe);
router.post("/addReview", addReview);

// Get recent recipes
router.post("/getrecentrecipes", getRecentRecipes);

// Search recipes by name
router.get("/search", searchRecipes);

router.post("/addSeasoning", addSeasoning);
router.post("/addGroceries", addGroceries);
router.post("/removeGroceryItems", removeGroceryItems);

module.exports = router;
