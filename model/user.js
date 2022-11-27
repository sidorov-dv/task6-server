const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    messages: [
      {
        date: Date,
        from: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        text: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Task6", userSchema);

module.exports = User;
