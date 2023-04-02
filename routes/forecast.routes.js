const router = require("express").Router();
const ForecastController = require("../controllers/forecast.controller")
const verifyLogin = require("../middlewares/verify-login");

router.post("/generate", verifyLogin, ForecastController.generateForecast);

module.exports = router;