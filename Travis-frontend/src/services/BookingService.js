import axios from "axios"
export const axiosJWT = axios.create()

export const createBooking = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/booking/create-booking`, data)
    return res.data
}
export const getAllBooking = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/booking/getAll-booking`,data) 
    return res.data
}
export const getDetailsBooking = async (id,access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/booking/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteBooking = async (id,access_token,data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/booking/delete-booking/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const updateBooking = async (id,access_token,data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/booking/update-booking/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyBooking = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/booking/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}