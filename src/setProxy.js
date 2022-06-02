const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/data", {
      target: "http://146.56.148.12:5000",
      changeOrigin: true,
    })
  );
};