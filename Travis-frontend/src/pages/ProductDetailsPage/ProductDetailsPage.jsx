import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <>
      <div style={{ marginLeft: '20px' }}>
        <h3 style={{ margin: "10px" }}><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Chi tiết sản phẩm</h3>
      </div>
      <div style={{ width: '100%', background: '#efefef', height: '100%', paddingTop: "20px" }}>
        <div style={{ width: '1270px', height: '100%', margin: '0 auto' }} >

          <ProductDetailsComponent idProduct={id} />
        </div>
      </div>
    </>
  )
}

export default ProductDetailsPage