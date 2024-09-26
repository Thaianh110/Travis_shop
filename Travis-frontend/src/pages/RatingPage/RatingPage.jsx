import { useNavigate, useParams } from "react-router-dom"
import * as ProductService from "../../services/ProductService"
import { useEffect, useState } from 'react'
import style from "./style.css"
import InputForm from "../../components/InputForm/InputForm"
import { StarFilled } from '@ant-design/icons'
import { CloseCircleOutlined } from '@ant-design/icons'
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { message } from "antd"
import Loading from "../../components/LoadingComponent/Loading"
const RatingPage = (req, res) => {
    const navigate = useNavigate()
    const idProduct = useParams().id
    const [product, setProduct] = useState()
    const [rating, setRating] = useState('')

    const fetchProduct = async () => {

        const res = await ProductService.getDetailsProduct(idProduct)
        setProduct(res?.data)



    }
    const handleOnchange = async (event) => {
        setRating(event.target.value);

    }

    const handleRating = () => {
        if (rating) {
            const data = {

                ratingScore: product.ratingScore + Number(rating),
                ratingCount: product.ratingCount + 1
            }
            const res = ProductService.updateRatingProduct(idProduct, data)

            message.success("Đánh giá thành công")
            navigate(`/product-details/${idProduct}`)
        }
    }



    useEffect(() => {
        fetchProduct()
    }, [])

    return (

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: 'rgba(0, 0, 0, 0.53)', width: "100%", marginTop: "1px", fontSize: "20px", height: "100%", padding: "0 0 80px" }}>

            <div style={{ width: "40%", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #fff", marginTop: "40px", boxSizing: 'border-box' }}>
                <div className="ratingcloser">
                    <CloseCircleOutlined onClick={() => { navigate(`/product-details/${idProduct}`) }} />
                </div>
                <div className="rating">
                    <div className="ratingheader">Đánh giá sản phẩm</div>
                    <div className="ratingname">
                        Tên: {product?.name}
                    </div>
                    <div className="ratingimg">
                        <img src={product?.image}></img>
                    </div>
                    <div className="ratingprice">Giá: {convertPrice(product?.price)}</div>
                    <div>
                        <span style={{ marginRight: "10px" }}>Đánh giá:</span>
                        <select value={rating} onChange={handleOnchange}>
                            <option >---</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>


                    <ButtonComponent
                        disabled={!rating}
                        onClick={handleRating}
                        size={40}
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textbutton={'Đánh giá'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    />
                </div>
            </div>
        </div>

    )

}
export default RatingPage