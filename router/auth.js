const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser) return res.status(409).json("User already exists");

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: encryptedPassword,
      name: req.body.name,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email,
        name: user.name
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "2h",
      }
    );

    user.token = token
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user && (await bcrypt.compare(req.body.password, user.password))) {
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: req.body.email,
                    name: user.name
                },
                process.env.JWT_TOKEN,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token
            const {password, ...other} = user._doc
            return res.status(200).json(other)
        }

        return res.status(400).json("Invalid Credentials")
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
