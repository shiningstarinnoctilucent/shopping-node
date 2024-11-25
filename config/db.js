const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("shopping_db");
        console.log("MongoDB connection successful");
        return db;
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
