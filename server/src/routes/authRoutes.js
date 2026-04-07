const express = require("express");

const {
  signup,
  login,
  me,
  getMyself,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/me", me);
router.post("/getMyself", getMyself);

module.exports = router;
