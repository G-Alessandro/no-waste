const { createProxyMiddleware } = require("http-proxy-middleware");
const { verifyToken } = require("./verifyToken.js");

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
  services.forEach(({ route, target, requiresAuthentication }) => {
    const proxyOptions = {
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route}`]: "",
      },
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("x-gateway-secret", process.env.GATEWAY_SECRET);
      },
    };

    const middlewares = [];

    if (requiresAuthentication) {
      middlewares.push(verifyToken);
    }

    middlewares.push(rateLimitAndTimeout);
    middlewares.push(createProxyMiddleware(proxyOptions));

    app.use(route, ...middlewares);
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
