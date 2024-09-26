import axios from "axios"

export const createEvalute = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/evalute/create-evalute`,data) 
    return res.data;
}
export const getDetailsEvalute = async(id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/evalute/get-details/${id}`)
    return res.data
}
export const getAllEvalute = async(data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/evalute/get-all`,data)
    return res.data
}