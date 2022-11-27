const router = require("express").Router();
const User = require("../model/user");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (user) {
      res.status(200).json({ message: "User has been already exist" });
    } else {
      await new User(req.body).save();
      res
        .status(201)
        .json({ message: "New user has been created successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
