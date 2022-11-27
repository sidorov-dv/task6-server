const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const events = require("events");
const createUsersRoute = require("./routes/create");
const getAllUsersRoute = require("./routes/getAll");
const User = require("./model/user");

const emitter = new events.EventEmitter();

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5555;
const DB_URL = process.env.DB;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect to DB successfully"))
  .catch((err) => console.log("Connect to DB failed", err));

app.get("/", (req, res) => {
  res.send("Welcome to chat-messages app!");
});

app.use("/api/createUsers", createUsersRoute);
app.use("/api/getAll", getAllUsersRoute);

app.get("/getMessage", async (req, res) => {
  try {
    const users = await User.find();
    emitter.once("newMessage", (message) => {
      res.status(200).json({ message, users });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/postMessage", async (req, res) => {
  try {
    const message = req.body;
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res
        .status(409)
        .json({ message: "User not found. Try another name" });
    } else {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            messages: {
              date: req.body.messages.date,
              from: req.body.messages.from,
              title: req.body.messages.title,
              text: req.body.messages.text,
            },
          },
        }
      );
      emitter.emit("newMessage", message);
      res
        .status(200)
        .json({ message: "message has been sent, user updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Listening port: ${PORT}`));
