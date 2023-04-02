const router = require("express").Router();
const ForecastController = require("../controllers/forecast.controller")

router.post("/generate", verifyLogin, ForecastController.generateForecast);

module.exports = router;