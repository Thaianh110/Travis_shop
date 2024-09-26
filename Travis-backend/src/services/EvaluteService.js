const { default: mongoose } = require("mongoose")
const Evalute = require("../models/EvaluteModel")
const Product = require("../models/ProductModel")
const User = require("../models/UserModel")


const createEvalute = (newEvalute) => {
    return new Promise(async (resolve, reject) => {
        const { user, comment, rating, product } = newEvalute
        try {
            const checkUser = await User.findById(user)
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại"
                })
            }
            const checkProduct = await Product.findById(product)
            if (checkProduct === null) {
                resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tại"
                })
            }
            const createdEvalute = await Evalute.create({
                user: user,
                comment,
                rating,
                product: product,
            })
            if (createdEvalute) {
                resolve({
                    status: 'OK',
                    message: 'Đánh giá sản phẩm thành công',
                    data: createdEvalute
                })
            }
        } catch (error) {
            console.log("error", error)
            reject(error)
        }
    })
}
const getDetailsEvalute = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const objectId = new mongoose.Types.ObjectId(id)
            const evalute = await Evalute.find({
                product: objectId,
            }).populate("user")

            resolve({
                status: 'OK',
                message: 'Đánh giá sản phẩm thành công',
                data: evalute
            })
        } catch (error) {
            reject(error)
        }
    })
}
const getAllEvalute = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allEvalute = await Evalute.find().sort({ createdAt: - 1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Lấy tất cả đánh giá thành công',
                data: allEvalute
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createEvalute,
    getDetailsEvalute,
    getAllEvalute
}