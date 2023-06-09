const router = require("express").Router();

const userRoutes = require("./user.routes");
const cropRoutes = require("./crop.routes");
const forecastRoutes = require("./forecast.routes");

router.use("/api/users", userRoutes);
router.use("/api/crops", cropRoutes);
router.use("/api/forecast", forecastRoutes);

module.exports = router;