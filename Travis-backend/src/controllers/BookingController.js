const { log } = require('console');
const BookingService = require('../services/BookingService')
const JwtService = require('../services/JwtService')
const moment = require('moment')

const formatcurrentDate = (date) => {
    const day = String(date.getDate()).padStart(2, 0);
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
function convertDateFormat(inputDate) {
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}
function compareHourandMinute(time1, time2) {
    let [hour1, minute1] = time1.split(":");
    let [hour2, minute2] = time2.split(":");
    hour1 = parseInt(hour1)
    minute1 = parseInt(minute1)
    hour2 = parseInt(hour2)
    minute2 = parseInt(minute2)
    if(hour1 <= 7 || hour1 >= 20){
        if(hour1 === 6 && minute1 >= 30 ){
            return 1;
        }else if(hour1 === 19 && minute1 <=30) {
            return 1;
        }
        return -1;
    }
    else if(hour1 < hour2 ){
        return -2 ;
    }else if(hour1 > hour2){
        return 1;
    }else {
        if(Number(minute1 - minute2) < 30){
            return -3;
        }
    }     
}
    function changeHourandTime() {
        const Time = new Date()
        const gio = String(Time.getHours()).padStart(2, 0);
        const phut = String(Time.getMinutes()).padStart(2, 0);
        return gio + ":" + phut;
    }


    const createBooking = async (req, res) => {
        try {
            const { bookingName, bookingEmail, bookingPhone, bookingDate, bookingTime } = req.body
            const email_reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const phone_reg = /((09|03|07|08|05)+([0-9]{8})\b)/
            // kiem tra date
            const currentDate = new Date()
            const formatCurrentDate = formatcurrentDate(currentDate)
            const formatBookingDate = convertDateFormat(bookingDate)
            const date1 = moment(formatBookingDate, 'DD/MM/YYYY');
            const date2 = moment(formatCurrentDate, 'DD/MM/YYYY');
            const currentTime = changeHourandTime();
            console.log('booking', formatBookingDate)
            console.log('current', formatCurrentDate)
            const isCheckPhone = phone_reg.test(bookingPhone)
            // const isCheckEmail = email_reg.test(bookingEmail)
            console.log('curtime', currentTime)
            console.log('bootime', bookingTime)
            const isCheckTime = compareHourandMinute(bookingTime, currentTime);
            console.log('time', isCheckTime)
            if (!bookingName || !bookingPhone || !bookingDate || !bookingTime) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'Vui lòng nhập đầy đủ thông tin',
                });
            // } else if (!isCheckEmail) {
            //     return res.status(200).json({
            //         status: 'ERR',
            //         message: 'Không đúng định dạng email!',
            //     });
            } else if (!isCheckPhone) {
                if (bookingPhone.length !== 10) {
                    return res.status(200).json({
                        status: 'ERR',
                        message: 'Số điện thoại gồm 10 số',

                    });
                } else {
                    return res.status(200).json({
                        status: 'ERR',
                        message: 'Sai định dạng số điện thoại',

                    });
                }
            } else if (date1.isBefore(date2)) {
                return res.status(200).json({
                    status: "ERR",
                    message: "Không chọn ngày nhỏ hơn ngày hiện tại",
                });

            }
            else if (!(date1.isAfter(date2))) {
                if (isCheckTime === -1) {
                    return res.status(200).json({
                        status: "ERR",
                        message: "Cửa hàng hoạt động từ lúc 8h:00 đến 20h:00"
                    })
                } else if (isCheckTime === -2) {
                    return res.status(200).json({
                        status: "ERR",
                        message: "Hiện tại đã qua thời gian này"
                    })
                }else if(isCheckTime === -3){
                    return res.status(200).json({
                        status: "ERR",
                        message: "Đây là ngày và giờ hiện tại vui lòng đặt lịch thời gian trên 30 phút trở lên"
                    })
                }
            }
            const response = await BookingService.createBooking(req.body)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }

    const updateBooking = async (req, res) => {
        try {
            const bookingId = req.params.id
            const data = req.body
            if (!bookingId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The bookingId is required'
                })
            }
            const response = await BookingService.updateBooking(bookingId, data)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }

    const deleteBooking = async (req, res) => {
        try {
            const bookingId = req.params.id
            if (!bookingId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The bookingId is required'
                })
            }
            const response = await BookingService.deleteBooking(bookingId)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }

    const deleteMany = async (req, res) => {
        try {
            const ids = req.body.ids
            if (!ids) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The ids is required'
                })
            }
            const response = await BookingService.deleteManyBooking(ids)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }


    const getAllBooking = async (req, res) => {
        try {
            const response = await BookingService.getAllBooking()
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }

    const getDetailsBooking = async (req, res) => {
        try {
            const bookingId = req.params.id
            if (!bookingId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The id is required'
                })
            }
            const response = await BookingService.getDetailsBooking(bookingId)
            return res.status(200).json(response)
        } catch (e) {
            return res.status(404).json({
                message: e
            })
        }
    }


    module.exports = {
        createBooking,
        getDetailsBooking,
        updateBooking,
        deleteBooking,
        getAllBooking,
        deleteMany
    }
