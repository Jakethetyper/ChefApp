require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

console.log(process.env.brandon)
app.get("test", (req, res) => {
  res.json({ message: "Server is working" });
});

const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
