const router = require("express").Router();
const User = require("../model/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");

const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const isEmailExist = await User.findOne({ email: req.body.email });

  // throw error when email already registered
  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });
  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email is wrong" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Email or password failed" });
  res.json({
    error: null,
    data: {
      message: "Login successful",
    },
  });
});
module.exports = router;
