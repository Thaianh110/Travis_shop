import React, { } from 'react'
import NavBarComponent from '../../components/NavbarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import style from "./style.css"
import { Col, Pagination, Row, Button, Popover } from 'antd'
import { WrapperNavbar, WrapperProducts, WrapperButtonMore, WrapperFilter } from './style'
import { useLocation, useNavigate } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect } from 'react'
import { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import TableComponent from '../../components/TableComponent/TableComponent'
import InputForm from '../../components/InputForm/InputForm'

const ProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  // const { state } = useLocation()
  const navigate = useNavigate()
  const [maxSearchPrice, setMaxSearchPrice] = useState()
  const [minSearchPrice, setMinSearchPrice] = useState()
  const [searchPrice, setSearchPrice] = useState()


  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 5,
    total: 3,
  })
  const fetchProductAll = async (search, limit, page, minPrice, maxPrice) => {
    setLoading(true)

    const res = await ProductService.getAllProduct(search, limit, page, minPrice, maxPrice)
    if (res?.status === 'OK') {

      setLoading(false)
      setProducts(res?.data)


      setPanigate({ ...panigate, total: res?.total, totalType: res?.totalType })
    } else {
      setLoading(false)
    }
    return res


  }
  const handleOnChangeMax = async (value) => {
    setMaxSearchPrice(value)
  }
  const handleOnChangeMin = async (value) => {
    setMinSearchPrice(value)
  }
  const handleFilter = () => {
    setSearchPrice({
      minPrice: minSearchPrice,
      maxPrice: maxSearchPrice
    })
  }
  const handleFilterCancel = () => {
    setSearchPrice()
  }


  useEffect(() => {
    fetchProductAll(searchDebounce, panigate.limit, panigate.page, searchPrice?.minPrice, searchPrice?.maxPrice)
  }, [searchDebounce, panigate.limit, panigate.page, searchPrice?.minPrice, searchPrice?.maxPrice])

  const onChange = (current, pageSize) => {


    setPanigate({ ...panigate, page: current - 1, limit: pageSize })
  }

  const content = (
    <div style={{ width: '100%' }}>
      <InputForm style={{ marginBottom: "5px" }} placeholder="Giá thấp nhất" value={minSearchPrice} onChange={handleOnChangeMin}></InputForm>
      <InputForm style={{ marginBottom: "5px" }} placeholder="Giá cao nhất" value={maxSearchPrice} onChange={handleOnChangeMax}></InputForm>
      <Button style={{ marginRight: "5px" }} onClick={handleFilter} type="primary">Lọc</Button>
      <Button onClick={handleFilterCancel} type="danger">Hủy</Button>
    </div>
  )
  return (

    <Loading isLoading={loading}>
      <div style={{ marginLeft: '20px' }}>
        <h3 style={{ margin: "10px" }}><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Sản phẩm</h3>
      </div>

      <div style={{ width: '100%', background: '#efefef', height: '100%' }}>
        <div style={{ width: '100%', margin: '0 auto', height: '100%' }}>

          <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
            <WrapperNavbar span={4} >
              <NavBarComponent />

            </WrapperNavbar>
            <Col span={20} style={{ flex: "unset", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>


              <WrapperFilter content={content} title="Lọc theo giá" trigger="click">
                <Button>Giá</Button>
              </WrapperFilter>


              <WrapperProducts >

                {products?.map((product) => {
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

                })}
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

export default ProductPage