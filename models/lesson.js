const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const lessonCollection = "lessons";

const LessonModel = {
    async create(lessonData) {
        const db = getDB();
        const lesson = {
            ...lessonData,
            space: Number(lessonData.space),
            price: Number(lessonData.price),
            createdAt: new Date(),
        };
        return db.collection(lessonCollection).insertOne(lesson);
    },

    async findAllWithFilters(queryParams) {
        const db = getDB();
        const filter = {};
        const sort = {};

        // Full-text search across multiple fields
        if (queryParams.search) {
            filter.$or = [
                { subject: { $regex: queryParams.search, $options: "i" } },
                { location: { $regex: queryParams.search, $options: "i" } },
                { description: { $regex: queryParams.search, $options: "i" } },
                { price: { $regex: queryParams.search, $options: "i" } },
            ];
        }

        // Specific field filtering
        if (queryParams.keyword) {
            filter.title = { $regex: queryParams.keyword, $options: "i" };
        }

        // Price range filtering
        if (queryParams.minPrice || queryParams.maxPrice) {
            filter.price = {};
            if (queryParams.minPrice)
                filter.price.$gte = Number(queryParams.minPrice);
            if (queryParams.maxPrice)
                filter.price.$lte = Number(queryParams.maxPrice);
        }

        // Sorting
        if (queryParams.sort) {
            const [field, order] = queryParams.sort.split(":");
            sort[field] = order === "desc" ? -1 : 1;
        }
        const result = await db
            .collection(lessonCollection)
            .find(filter)
            .sort(sort)
            .toArray();
        return result;
    },

    async update(id, updateData) {
        const db = getDB();
        const filter = { _id: new ObjectId(String(id)) };

        // Remove _id from updateData if present
        delete updateData._id;

        const result = await db
            .collection(lessonCollection)
            .findOneAndUpdate(
                filter,
                { $set: updateData },
                { returnDocument: "after" }
            );

        return result.value;
    },

    async updateSpace(id, space) {
        this.update(id, { space: space });
    },
};

module.exports = LessonModel;