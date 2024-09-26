const express = require("express");
const router = express.Router()
const bookingController = require('../controllers/BookingController');

router.post('/create-booking', bookingController.createBooking)
router.get('/get-details/:id',bookingController.getDetailsBooking)
router.put('/update-booking/:id',bookingController.updateBooking)
router.delete('/delete-booking/:id',bookingController.deleteBooking)
router.get('/getAll-booking',bookingController.getAllBooking)
router.post('/delete-many', bookingController.deleteMany)
module.exports = router