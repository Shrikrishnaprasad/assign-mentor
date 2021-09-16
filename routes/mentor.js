const router = require("express").Router();
const Mentor = require("../models/Mentor");
const Students = require("../models/Students");

//getAll mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a mentor by :id
router.get("/get/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ _id: req.params.id });
    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json(error);
  }
});

//assign mentor for students
router.post("/assignStudents/:id", async (req, res) => {
  const mentorId = req.params.id;
  const students = req.body.students;
  try {
    const mentor = await Mentor.findOne({ _id: req.params.id });
    const updStudents = students.map(async (student) => {
      await Mentor.findByIdAndUpdate(
        { _id: mentorId },
        { $addToSet: { studentsAssigned: students } },
        { new: true }
      );

      await Students.findByIdAndUpdate(
        { _id: student },
        { isMentorAssigned: true, mentorId: mentorId, mentorName: mentor.name },
        { new: true }
      );
    });

    res.status(201).json("Students assigned successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//create mentor
router.post("/create", async (req, res) => {
  const newMentor = new Mentor(req.body);
  try {
    const savedMentor = await newMentor.save();
    res.status(201).json(savedMentor);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
