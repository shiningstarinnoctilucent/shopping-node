const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect the database before starting the server.
async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`The server runs on port: ${PORT}`);
        });
    } catch (err) {
        console.error("Server startup failed:", err);
    }
}

startServer();
