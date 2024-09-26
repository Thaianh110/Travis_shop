const Booking = require("../models/BookingModel")
const EmailService=require("../services/EmailService")
const createBooking = (newBooking) => {
    return new Promise(async (resolve, reject) => {
        const { bookingName, bookingEmail, bookingPhone, bookingDate, bookingTime} = newBooking
        console.log('checkBookingEmail',bookingEmail)
        try {
            
            const checkBookingEmail = await Booking.findOne({
                bookingEmail: bookingEmail
            })
            console.log('checkBookingEmail',checkBookingEmail)
            if(checkBookingEmail){
                resolve({
                    status:"ERR",
                    message:"The email is already"
                })
            }
            const bookingCode = bookingName + (Math.random()*1000).toFixed(0)
            const createdBooking = await Booking.create({
                bookingName, 
                bookingEmail, 
                bookingPhone,
                bookingDate, 
                bookingTime,
                bookingCode
            })
            console.log('createBooking',createBooking)
            if (createdBooking) {
                await EmailService.sendEmailCreateBooking(bookingEmail,bookingName,bookingDate,bookingTime,bookingCode)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdBooking
                })
            }  
        } catch (e) {
            console.log('e',e)
            reject(e)
        }
    })
}



const updateBooking = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBooking = await Booking.findOne({
                _id: id
            })
            if (checkBooking === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Booking is not defined'
                })
            }

            const updateBooking = await Booking.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateBooking
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBooking = await Booking.findOne({
                _id: id
            })
            if (checkBooking === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Booking is not defined'
                })
            }

            await Booking.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Booking success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyBooking = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await Booking.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBooking = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBooking = await Booking.find().sort({createdAt: -1, updatedAt: -1})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allBooking
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('id',id)
            const booking = await Booking.findOne({
                _id: id
            })
            console.log("id",booking)
            if (booking === null) {
                resolve({
                    status: 'ERR',
                    message: 'The booking is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: booking
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createBooking,
    getDetailsBooking,
    updateBooking,
    deleteBooking,
    getAllBooking,
    deleteManyBooking
}