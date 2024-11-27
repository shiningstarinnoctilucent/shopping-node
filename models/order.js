const { getDB } = require("../config/db");

const orderCollection = "orders";

const OrderModel = {
    async create(orderData) {
        const db = getDB();
        const order = { ...orderData };
        const result = await db.collection(orderCollection).insertOne(order);
        return { ...order, _id: result.insertedId };
    },
};

module.exports = OrderModel;
