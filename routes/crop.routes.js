const router = require("express").Router();
const CropController = require("../controllers/crop.controller");
const verifyLogin = require("../middlewares/verify-login");

router.get("/", verifyLogin, CropController.listCrops);
router.get("/:cropId", verifyLogin, CropController.getCrop);
router.post("/create", verifyLogin, CropController.addCrop);
router.put("/:cropId/update", verifyLogin, CropController.updateCrop);
router.delete("/:cropId/delete", verifyLogin, CropController.deleteCrop);

module.exports = router;