const mongoose = require("mongoose");

const MentorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  studentsAssigned: {
    type: Array,
  },
});
module.exports = mongoose.model("Mentor", MentorSchema);
