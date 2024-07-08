const mongoose = require('mongoose')
const sliderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true  },
        image: { type: String },
    },
    {
        timestamps: true
    }
);
const Slider = mongoose.model("Slider", sliderSchema);
module.exports = Slider;