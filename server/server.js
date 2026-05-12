const jsonServer = require("json-server");
const express = require("express");

const app = express();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 5000;

app.use(middlewares);
app.use(express.json());

/**
 * Health check – MUST be fast, no DB, no auth
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Ecommerce JSON Server running on port ${PORT}`);
});