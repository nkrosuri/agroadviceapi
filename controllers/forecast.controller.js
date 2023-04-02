const CropModel = require("../models/crop.model");

class Forecast {
    static async generateForecast(req, res) {
        try {
            const { coordinates, cropId, areaOfFarm } = req.body;
            if (!coordinates || !coordinates.length !== 2 || typeof coordinates[0] !== "number" || typeof coordinates[0] !== "number" || !check_lat_lon(coordinates[0], coordinates[1])) {
                return res.status(400).send({ error: "invalid coordinates." });
            }
            if (!cropId) {
                return res.status(400).send({ error: "cropId required." });
            }
            if (!areaOfFarm || typeof areaOfFarm !== "number" || areaOfFarm < 1) {
                return res.status(400).send({ error: "areaOfFarm should be minimum 1 acre." });
            }
            const crop = await CropModel.findById(cropId).lean().exec();
            if (!crop) {
                return res.status(404).send({ error: "Crop not found." });
            }
            const totalSqFeet = areaOfFarm * 43560;
            const totalWaterRequired = crop.waterRequiredPerSqFeet * totalSqFeet;
            const probabilityOfWater = waterRequired;
            res.send({
                ...crop,
                totalWaterRequired,
                probabilityOfWater,
                successRate: `${(probabilityOfWater * 100) / totalWaterRequired} %`
            });
        } catch (err) {
            console.log("Forecast.generateForecast", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }
}

const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

function check_lat_lon(lat, lon) {
    let validLat = regexLat.test(lat);
    let validLon = regexLon.test(lon);
    return validLat && validLon;
}

module.exports = Forecast;