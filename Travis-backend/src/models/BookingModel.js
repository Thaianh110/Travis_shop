const mongoose = require('mongoose')
const bookingSchema = new mongoose.Schema(
    {
        bookingName: { type: String,required:true},
        bookingEmail: { type: String},
        bookingPhone: { type: String,required:true},
        bookingDate: { type: String,required:true},
        bookingTime: { type: String,required:true},
        bookingCode: {type:String}
    },
    {
        timestamps: true
    }
);
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;