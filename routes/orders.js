const express = require("express");
const router = express.Router();
const OrderModel = require("../models/order");
const LessonModel = require("../models/lesson");
const { ObjectId } = require("mongodb");

// POST /api/orders - Create a new order
router.post("/", async (req, res, next) => {
    try {
        const orderData = {
            lessons: req.body.lessons.map((lesson) => ({
                id: new ObjectId(String(lesson.id)),
                spaces: lesson.spaces,
            })),
            totalAmount: req.body.totalAmount,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            status: "pending",
            createdAt: new Date(),
        };

        const newOrder = await OrderModel.create(orderData);

        // 更新课程的 spaces 属性
        for (const lesson of orderData.lessons) {
            await LessonModel.updateSpace(lesson.id, lesson.spaces);
        }

        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
