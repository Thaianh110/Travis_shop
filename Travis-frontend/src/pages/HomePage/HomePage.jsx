import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { useEffect } from 'react'

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from 'react-router-dom'


const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)


  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)

    return res

  }


  const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })



  return (
    <>
      <div style={{ width: '100%', margin: '0 auto', padding: "0 50px" }}>
        <WrapperTypeProduct>
          <div className="container-fluid menu">
            {/* navbar */}
            <section className="menu">
              <nav className="navbar navbar-expand-lg bg-body-tertiary ">
                <div className="container">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon">
                      <i className="fa-solid fa-bars" />
                    </span>
                  </button>
                  <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          aria-current="page"
                          href="/"
                        >
                          {" "}
                          TRANG CHỦ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link active" href="dichvu">
                          DỊCH VỤ
                        </a>
                      </li>
                      <li className="nav-item">

                        <a className="nav-link active" href="/product/get-all" >
                          {" "}
                          SẢN PHẨM
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </section>
          </div>
        </WrapperTypeProduct>
      </div>
      <Loading isLoading={isLoading || loading}>

        <div className='body' style={{ width: '100%', backgroundColor: '#efefef', padding: "30px" }}>
          <div id="container" style={{ height: '100%', width: '90%', padding: "0 80px", margin: '0 auto' }}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
            <WrapperProducts>
              {products?.data?.map((product) => {
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
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <WrapperButtonMore
                textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" styleButton={{
                  border: `1px solid ${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`, color: `${products?.total === products?.data?.length ? '#f5f5f5' : '#9255FD'}`,
                  width: '240px', height: '38px', borderRadius: '4px'
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                onClick={() => setLimit((prev) => prev + 5)}
              />
            </div>
          </div>
        </div>
      </Loading>

    </>
  )
}

export default HomePage 