const router = require("express").Router();
const Mentor = require("../models/Mentor");
const Students = require("../models/Students");

//getAll students with not assigned by mentor
router.get("/", async (req, res) => {
  try {
    const students = await Students.find({ isMentorAssigned: false });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a student by id
router.get("/get/:id", async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await Students.findOne({ _id: studentId });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error);
  }
});

//getAll students are assigned by mentor
router.get("/isAssigned", async (req, res) => {
  try {
    const students = await Students.find({ isMentorAssigned: true });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error);
  }
});

//create students
router.post("/create", async (req, res) => {
  const newStudents = new Students(req.body);
  try {
    const savedStudents = await newStudents.save();
    res.status(201).json(savedStudents);
  } catch (err) {
    res.status(500).json(err);
  }
});

//change mentor for a student
router.post("/changeMentor/:id", async (req, res) => {
  const studentId = req.params.id;
  const newMentorId = req.body.mentorId;
  try {
    const oldStudent = await Students.findOne({ _id: studentId });
    const oldMentor = await Mentor.findOne({ _id: oldStudent.mentorId });
    const newMentor = await Mentor.findOne({ _id: newMentorId });

    const rmvdOldStdId = oldMentor.studentsAssigned.filter(
      (stdid) => stdid !== studentId
    );
    console.log(rmvdOldStdId);
    const updOldMentor = await Mentor.findByIdAndUpdate(
      { _id: oldMentor._id },
      { studentsAssigned: [...rmvdOldStdId] },
      { new: true }
    );
    const updStudent = await Students.findByIdAndUpdate(
      { _id: studentId },
      { mentorId: newMentorId, mentorName: newMentor.name },
      { new: true }
    );
    const updMentor = await Mentor.findByIdAndUpdate(
      { _id: newMentorId },
      { $addToSet: { studentsAssigned: studentId } },
      { new: true }
    );
    res.status(201).json("Mentor changed successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
