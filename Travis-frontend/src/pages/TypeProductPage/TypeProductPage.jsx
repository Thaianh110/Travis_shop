import React, { } from 'react'
import NavBarComponent from '../../components/NavbarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect } from 'react'
import { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import { useNavigate } from 'react-router-dom'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const { state } = useLocation()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 5,
        total: 3,
    })



    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.total, totalType: res?.totalType })
        } else {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])


    const onChange = (current, pageSize) => {
        console.log("cur", current, pageSize)
        setPanigate({ ...panigate, page: current - 1, total: pageSize })
    }
    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#efefef' }}>
                <div style={{ width: '100%', margin: '0 auto', height: '100%' }}>
                    <h3 style={{ margin: "2px 0 0 50px" }}><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Sản phẩm</h3>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
                        <WrapperNavbar span={4} >
                            <NavBarComponent />
                        </WrapperNavbar>
                        <Col span={20} style={{ flex: "unset", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                            <WrapperProducts >
                                {
                                    products?.filter((pro) => {
                                        if (searchDebounce === '') {
                                            return pro

                                        } else if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                            return pro
                                        }
                                    })?.map((product) => {
                                        return (
                                            <CardComponent
                                                key={product._id}
                                                countInStock={product.countInStock}
                                                description={product.description}
                                                image={product.image}
                                                name={product.name}
                                                price={product.price}
                                                rating={product.rating}
                                                type={product.type}
                                                selled={product.selled}
                                                discount={product.discount}
                                                id={product._id}
                                                ratingScore={product.ratingScore}
                                                ratingCount={product.ratingCount}
                                            />
                                        )
                                    })
                                }
                            </WrapperProducts>
                            <div style={{ margin: "10px 0 20px" }}>
                                <Pagination defaultCurrent={panigate.page} total={panigate.totalType} pageSize={panigate.limit} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    )
}

export default TypeProductPage