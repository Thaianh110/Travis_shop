import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct, WrapperPriceTextProductDiscount } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import { useMemo } from 'react'
import RatingComponent from '../RatingComponent/RatingComponent'
const ProductDetailsComponent = ({ idProduct }) => {
    const { id } = useParams()
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [productDetails, setProductDetails] = useState()
    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async () => {


        const res = await ProductService.getDetailsProduct(idProduct)


        setProductDetails(res?.data)


    }




    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetails?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if (type === 'increase') {
            if (!limited) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    useEffect(() => {
        fetchGetDetailsProduct()
    }, []

    )
    const isHidden = (productDetails?.discount === 0) ? true : false


    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        description: productDetails?.description,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    return (

        <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height: '100%' }}>
            <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                <Image src={productDetails?.image} alt="image prodcut" preview={false} />
                <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                    {/* <WrapperStyleColImage span={4} sty>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage> */}

                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: '10px' }}>
                <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                <div style={{ fontSize: "20px" }}>{productDetails?.description}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: "16px" }} >
                    <div >
                        {productDetails?.ratingScore ? (productDetails?.ratingScore / productDetails?.ratingCount).toFixed(1) : 0}

                        <Rate style={{ marginLeft: "4px" }} allowHalf defaultValue={productDetails?.ratingScore ? (productDetails?.ratingScore / productDetails?.ratingCount).toFixed(1) : 0} value={productDetails?.ratingScore ? (productDetails?.ratingScore / productDetails?.ratingCount).toFixed(1) : 0} />
                    </div>
                    <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0}</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <div style={{ visibility: isHidden ? "hidden" : "visible", height: isHidden ? "0" : "100%" }}>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </div>
                    <WrapperPriceTextProductDiscount>{convertPrice((100 - productDetails?.discount) * productDetails?.price / 100)}
                        <div id='discount' style={{ height: "", fontSize: "12px", marginLeft: "10px", background: 'red', color: "#fff", visibility: isHidden ? "hidden" : "visible" }}>giảm {productDetails?.discount}%</div>
                    </WrapperPriceTextProductDiscount>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                    <span>Giao đến </span>
                    <span className='address'>{user?.address}</span> -
                </WrapperAddressProduct>
                <LikeButtonComponent
                    dataHref={process.env.REACT_APP_IS_LOCAL
                        ? "https://developers.facebook.com/"
                        : window.location.href
                    }
                />
                <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                    <div style={{ marginBottom: '10px' }}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                            <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                        </button>
                        <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                            <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                        </button>
                    </WrapperQualityProduct>
                </div>
                <div style={{ display: 'flex', aliggItems: 'center', gap: '12px' }}>
                    <div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={() => {
                                handleAddOrderProduct();
                                navigate('/order')
                            }}
                            textbutton={'Mua ngay'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                        {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm hết hàng</div>}
                    </div>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            background: '#fff',
                            height: '48px',
                            width: '220px',
                            border: '1px solid rgb(13, 92, 182)',
                            borderRadius: '4px'
                        }}
                        textbutton={'Thêm vào giỏ hàng'}
                        onClick={handleAddOrderProduct}
                        styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                    ></ButtonComponent>
                </div>
            </Col>
            <div className='py-5'>
                <RatingComponent idProduct={id} setProductA={setProductDetails} />
            </div>
            <CommentComponent
                dataHref={process.env.REACT_APP_IS_LOCAL
                    ? "https://developers.facebook.com/"
                    : window.location.href
                }
                width="1270"
                idProduct={idProduct}
            />
        </Row >


    )
}

export default ProductDetailsComponent