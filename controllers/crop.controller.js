const CropModel = require("../models/crop.model");
const UserModel = require("../models/user.model");

class Crop {
    static async listCrops(req, res) {
        try {
            const crops = await CropModel.find({}).populate('addedBy', ["fullName", "_id"]).lean().exec();
            return res.send({ data: crops.map(crop => ({ ...crop, owned: String(crop.addedBy?._id) === req.user })) });
        } catch (err) {
            console.log("Crop.listCrops", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }

    static async getCrop(req, res) {
        try {
            const { cropId } = req.params;
            const crop = await CropModel.findById(cropId).populate('addedBy', ["fullName", "_id"]).lean().exec();
            if(!crop) {
                return res.status(404).send({ error: "Crop not found." });
            }
            return res.send({ ...crop, owned: String(crop.addedBy._id) === req.user });
        } catch (err) {
            console.log("Crop.getCrop", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }

    static async addCrop(req, res) {
        try {
            const { cropName, imageUrl, description, waterRequiredPerSqFeet, timePeriod } = req.body;
            const user = await UserModel.findOne({ _id: req.user, userType: "farm analyzer" }).lean().exec();
            
            if(!user) {
                return res.status(401).send({ error: "Not authorized to create crop." });
            }
            if (!cropName || typeof cropName !== "string") {
                return res.status(400).send({ error: "Crop Name is required." });
            }
            if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.match(/^https?:\/\/.+\/.+$/) || ![".jpg", ".jpeg", ".png"].find(ext => imageUrl.endsWith(ext))) {
                return res.status(400).send({ error: "Invalid image URL. Only jpg, jpeg, and png are supported." });
            }

            if (!description || typeof description !== "string" || description.length < 8) {
                return res.status(400).send({ error: "Description must be 8 characters." });
            }

            if (!waterRequiredPerSqFeet || typeof waterRequiredPerSqFeet !== "number") {
                return res.status(400).send({ error: "Water Required Per sqft is required." });
            }
            
            if (!timePeriod || typeof timePeriod !== "number" || (timePeriod >= 1 && timePeriod <= 12)) {
                return res.status(400).send({ error: "Time period is required." });
            }
            const cropNameAlreadyExist = await CropModel.findOne({ cropName }).lean().exec();
            if (cropNameAlreadyExist) {
                return res.status(400).send({ error: "Similar crop already exist." });
            }

            const crop = new CropModel({
                cropName,
                imageUrl,
                description,
                waterRequiredPerSqFeet,
                timePeriod,
                addedBy: req.user
            });
            await crop.save();
            return res.send(crop);
        } catch (err) {
            console.log("Crop.addCrop", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }

    static async updateCrop(req, res) {
        try {
            const { cropName, imageUrl, description, waterRequiredPerSqFeet, timePeriod } = req.body;
            const { cropId } = req.params;
            if (!cropName || typeof cropName !== "string") {
                return res.status(400).send({ error: "Crop Name is required." });
            }
            if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.match(/^https?:\/\/.+\/.+$/) || ![".jpg", ".jpeg", ".png"].find(ext => imageUrl.endsWith(ext))) {
                return res.status(400).send({ error: "Invalid image URL. Only jpg, jpeg, and png are supported." });
            }

            if (!description || typeof description !== "string" || description.length < 8) {
                return res.status(400).send({ error: "Description must be 8 characters." });
            }
            if (!waterRequiredPerSqFeet || typeof waterRequiredPerSqFeet !== "number") {
                return res.status(400).send({ error: "Water Required Per sqft is required." });
            }
            if (!timePeriod || typeof timePeriod !== "number" || (timePeriod >= 1 && timePeriod <= 12)) {
                return res.status(400).send({ error: "Time period is required." });
            }
            const crop = await CropModel.findById(cropId).lean().exec();
            if(!crop) {
                return res.status(404).send({ error: "Crop not found." });
            }
            if(cropName !== crop.cropName) {
                const cropNameAlreadyExist = await CropModel.findOne({ cropName }).lean().exec();
                if (cropNameAlreadyExist) {
                    return res.status(400).send({ error: "Similar crop already exist." });
                }
            }
            if(String(crop.addedBy) !== req.user) {
                return res.status(401).send({ error: "Not authorized to modify this crop." });
            }
            await CropModel.findByIdAndUpdate(cropId, { cropName, imageUrl, description, waterRequiredPerSqFeet, timePeriod }).lean().exec();
            res.send({ modified: true });
        } catch (err) {
            console.log("Crop.updateCrop", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }

    static async deleteCrop(req, res) {
        try {
            const { cropId } = req.params;
            const crop = await CropModel.findById(cropId).lean().exec();
            if(!crop) {
                return res.status(404).send({ error: "Crop not found." });
            }
            if(String(crop.addedBy) !== req.user) {
                return res.status(401).send({ error: "Not authorized to modify this crop." });
            }
            await CropModel.findByIdAndDelete(cropId);
            res.send({ deleted: true });
        } catch (err) {
            console.log("Crop.deleteCrop", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }
}

module.exports = Crop;