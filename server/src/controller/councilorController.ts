import express from "express";
import leadModel from "../model/leadModel";
import statusModel from "../model/statusModel";
import courseModel from "../model/courseModel";
import { generateUniqueId } from "../config";

const router = express.Router();

router.post("/leads", async (req, res) => {
  try {
    const newLead = new leadModel(req.body);
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: "Error creating lead", error });
  }
});

router.get("/leads", async (req, res) => {
  try {
    const leads = await leadModel.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
});

router.get("/leads/:leadId", async (req, res) => {
  try {
    const lead = await leadModel.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lead", error });
  }
});

router.put("/leads/:leadId", async (req, res) => {
  try {
    const lead = await leadModel.findByIdAndUpdate(
      req.params.leadId,
      req.body,
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ message: "Error updating lead", error });
  }
});

router.post("/courses", async (req, res) => {
  try {
    const { courseName, courseCategory, courseFees, courseDescription } =
      req.body;
    const courseId = generateUniqueId('course');
    const newCourse = new courseModel({
      courseId,
      courseName,
      courseCategory,
      courseFees,
      courseDescription,
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: "Error creating course", error });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

router.get("/courses/:courseId", async (req, res) => {
  try {
    const course = await courseModel.findOne({ courseId: req.params.courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
});

router.put("/courses/:courseId", async (req, res) => {
  try {
    const course = await courseModel.findOneAndUpdate(
      { courseId: req.params.courseId },
      { ...req.body },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: "Error updating course", error });
  }
});

router.delete("/courses/:courseId", async (req, res) => {
  try {
    const course = await courseModel.findOneAndDelete({
      courseId: req.params.courseId,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});

router.post("/statuses", async (req, res) => {
  try {
    const newStatus = new statusModel(req.body);
    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(400).json({ message: "Error creating status", error });
  }
});

router.get("/statuses", async (req, res) => {
  try {
    const statuses = await statusModel.find();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching statuses", error });
  }
});

export default router;
