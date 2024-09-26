import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async (search, limit, page, minPrice = 1, maxPrice = 10000000) => {
    let res = {}
    if (minPrice > 1 || maxPrice < 1000000) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all/?filter=price&minPrice=${minPrice}&maxPrice=${maxPrice}&limit=${limit}&page=${page}`)
    }
    else if (search?.length > 0) {

        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all/?filter=name&filter=${search}&limit=${limit}&page=${page}`)
    } else if (page) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all/?limit=${limit}&page=${page}`)

    }
    else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all/?limit=${limit}`)
    }
    return res.data
}

export const getProductType = async (type, page, limit) => {
    if (type) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all/?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const updateRatingProduct = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update-rating/${id}`, data)
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token,) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
    return res.data
}