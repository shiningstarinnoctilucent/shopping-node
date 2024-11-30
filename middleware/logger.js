const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    const userAgent = req.get("user-agent");

    // 记录请求开始
    console.log("\n=== Request Log ===");
    console.log(`Time: ${timestamp}`);
    console.log(`${method} ${url}`);
    console.log(`IP: ${ip}`);
    console.log(`User Agent: ${userAgent}`);

    // 如果有查询参数，记录它们
    if (Object.keys(req.query).length > 0) {
        console.log("Query Params:", req.query);
    }

    // 如果是 POST/PUT 请求，记录请求体
    if (["POST", "PUT"].includes(method) && req.body) {
        console.log("Request Body:", req.body);
    }

    // 记录响应
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Status Code: ${res.statusCode}`);
        console.log("=== End Request ===\n");
        return originalSend.call(this, body);
    };

    next();
};

module.exports = logger;
