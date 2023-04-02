const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
    cropName: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    waterRequiredPerSqFeet: {
        type: Number,
        require: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
},{
    versionKey: false
});

module.exports = mongoose.model("Crop", cropSchema);