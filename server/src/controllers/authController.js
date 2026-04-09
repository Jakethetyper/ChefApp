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

    return res.status(200).json({ token, user });
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

    // FIXED: compare against foundUser.passwordHash
    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(foundUser);
    return res.status(200).json({ token, user: foundUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login Failed" });
  }
};

const me = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ _id: userId });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { form, weight, userName, activity } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { userName },
      {
        $set: {
          userName: form.userName,
          height: form.height,
          weight: weight,
          gender: form.gender,
          firstName: form.firstName,
          lastName: form.lastName,
          activity,
        },
      },
      { new: true },
    );

    await updatedUser.save();

    return res.status(200).json({ message: "Updated User", updateUser });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Error updating user", error });
  }
};

module.exports = { login, signup, me, updateUser };
