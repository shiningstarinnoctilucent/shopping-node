const logger = (req, res, next) => {
    const startTime = Date.now();
    const logInfo = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        body: ["POST", "PUT"].includes(req.method) ? req.body : undefined,
    };

    // 重写 res.send 方法来捕获响应
    const originalSend = res.send;
    res.send = function (body) {
        const responseTime = Date.now() - startTime;

        // 整合所有日志信息
        console.log("\n=== Request Log ===");
        console.log(`Time: ${logInfo.timestamp}`);
        console.log(`${logInfo.method} ${logInfo.url}`);
        console.log(`IP: ${logInfo.ip}`);
        console.log(`User Agent: ${logInfo.userAgent}`);
        console.log(`Response Time: ${responseTime}ms`);

        if (logInfo.query) {
            console.log("Query Params:", logInfo.query);
        }

        if (logInfo.body) {
            console.log("Request Body:", logInfo.body);
        }

        console.log(`Status Code: ${res.statusCode}`);
        console.log("=== End Request ===\n");

        // 调用原始的 send 方法
        return originalSend.call(this, body);
    };

    next();
};

module.exports = logger;
