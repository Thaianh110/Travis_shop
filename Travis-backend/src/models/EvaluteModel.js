const mongoose = require('mongoose')

const evaluteSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        comment:{type: String},
        rating:{type: Number,require: true},
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            require: true
        }
    },
    {
        timestamps: true
    }
)
const Evalute = mongoose.model("Evalute", evaluteSchema);
module.exports = Evalute;