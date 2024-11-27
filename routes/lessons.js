const express = require("express");
const router = express.Router();
const LessonModel = require("../models/lesson");

// GET /api/lessons - Get all lessons (supports search and filtering)
router.get("/search", async (req, res, next) => {
    try {
        const lessons = await LessonModel.findAllWithFilters(req.query);
        res.json(lessons);
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
});
// POST /api/lessons - Create a new lesson
router.post("/", async (req, res, next) => {
    try {
        const newLesson = await LessonModel.create(req.body);
        res.status(201).json(newLesson);
    } catch (error) {
        next(error);
    }
});

// PUT /api/lessons/:id - Update a lesson
router.put("/:id", async (req, res, next) => {
    try {
        const lessonId = req.params.id;
        const updateData = req.body;

        const updatedLesson = await LessonModel.update(lessonId, updateData);

        if (!updatedLesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        res.json(updatedLesson);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
