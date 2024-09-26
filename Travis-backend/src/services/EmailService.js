const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
const moment = require('moment')
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email,orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.price} VND</b></div>
      <div>Bên dưới là hình ảnh của sản phẩm</div>
    </div>`
    attachImage.push({path: order.image})
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt hàng tại Travis barbershop", // Subject line
    text: "Xin chào", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại Travis barbershop</b></div> ${listItem}`,
    attachments: attachImage,
  });
}




const sendEmailCreateBooking = async (email,name,date,time,code) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
  // format day dd / mm / yyyy 
  date = moment().format('DD/MM/YYYY')
  let listBooking = '';
    listBooking += `<div>
    <div>
      Cảm ơn vì <b>${name}</b> đã tin tưởng dịch vụ của chúng tôi ,Chúng ta có hẹn vào lúc <b>${time}</b> Ngày <b>${date} </b></div>
      <div> Đây là mã code <b>${code}<b> quý khách đến và đợi thợ đọc mã code để sử dụng dịch vụ <div>
      <div>Rất mong được phục vụ quý khách vào thời gian đó ạ</div>
    </div>`
  

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt lịch cắt tóc tại Travis barbershop", // Subject line
    text: "Xin chào", // plain text body
    html: `<div><b>Bạn đã đặt lịch cắt thành công tại Travis barbershop</b></div> ${listBooking}`
  });
}

module.exports = {
  sendEmailCreateOrder,
  sendEmailCreateBooking
}