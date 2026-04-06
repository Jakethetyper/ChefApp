require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const signup = async (req, res) => {
  try {
    const { userName, firstName, lastName, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      passwordHash: hashedPassword,
      userName,
    });

    const token = createToken(user);

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json("signup failed");
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const foundUser = await User.findOne({ userName });

    if (!foundUser) {
      return res.status(401).json({ message: "No User Found" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(foundUser);
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login Failed" });
  }
};

const me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "_id firstName lastName userName",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { login, signup, me };
