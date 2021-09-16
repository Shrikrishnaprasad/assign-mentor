const mongoose = require("mongoose");

const StudentsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mentorId: {
    type: String,
    ref: "MentorId",
  },
  mentorName: {
    type: String,
  },
  isMentorAssigned: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Students", StudentsSchema);
