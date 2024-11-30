const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const path = require("path");
const { connectDB } = require("./config/db");
require("dotenv").config();
const lessonsRoutes = require("./routes/lessons");
const ordersRoutes = require("./routes/orders");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Static files middleware
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Handle missing images
app.use("/images", (req, res, next) => {
    res.status(404).json({
        error: "Image not found",
        message: `The image ${req.path} does not exist`,
    });
});

// Routes
console.log("Registering routes...");
app.use("/api/lessons", lessonsRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/", (req, res) => {
    res.send("Shopping API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server internal error" });
});

const PORT = process.env.PORT || 3000;

// Connect the database before starting the server.
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server startup failed:", err);
    }
}

startServer();
