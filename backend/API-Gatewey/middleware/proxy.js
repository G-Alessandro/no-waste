const { createProxyMiddleware } = require("http-proxy-middleware");
const { validateRequest } = require("./validation.js");

const rateLimit = 20;
const interval = 60 * 1000;

const requestCounts = {};

setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0;
  });
}, interval);

function rateLimitAndTimeout(req, res, next) {
  const ip = req.ip;

  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > rateLimit) {
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  req.setTimeout(15000, () => {
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    req.abort();
  });

  next();
}

function setupProxy(app, services) {
  services.forEach(({ route, target }) => {
    const proxyOptions = {
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route}`]: "",
      },
    };

    app.use(
      route,
      validateRequest,
      rateLimitAndTimeout,
      createProxyMiddleware(proxyOptions)
    );
  });
}

function handleNotFound(req, res) {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
}

module.exports = { rateLimitAndTimeout, setupProxy, handleNotFound };
