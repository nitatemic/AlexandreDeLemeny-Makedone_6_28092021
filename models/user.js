const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
