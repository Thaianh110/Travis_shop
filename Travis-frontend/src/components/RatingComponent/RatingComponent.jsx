import { Button, Image, Input, Rate } from 'antd';
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ratting.css'
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import * as ProductService from '../../services/ProductService'
import * as EvaluteService from '../../services/EvaluteService'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom'

import RatingBar from './RatingBar'
import { format } from 'date-fns';
const RatingComponent = ({ idProduct, setProductA }) => {

  const [userName, setName] = useState('');
  const user = useSelector((state) => state.user)

  const [comment, setComment] = useState();
  const [userAvatar, setUserAvatar] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [rating, setRating] = useState(0);
  const location = useLocation()
  const navigate = useNavigate()
  const [update, setUpdate] = useState(false);
  // State để lưu trữ danh sách đánh gi
  const [reviews, setReviews] = useState();
  const dispatch = useDispatch()

  const order = useSelector((state) => state.order)
  const [product, setProduct] = useState()

  const formatDate = (createdAt) => {
    // console.log(createdAt)
    // const parsedDate = parseISO(createdAt)
    const daterating = createdAt.toString()
    return format(new Date(daterating), 'HH: mm dd/MM/yyyy')
    // return format(parsedDate,"dd/MM/yyyy")
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }


  const fetchProduct = async () => {

    const res = await ProductService.getDetailsProduct(idProduct)
    setProduct(res?.data)


  }
  const fetchRating = async () => {
    const res_evalute = await EvaluteService.getDetailsEvalute(idProduct)
    setReviews(res_evalute?.data)

  }



  useEffect(() => {

    setName(user?.name)
    setUserAvatar(user?.avatar)

  }, [user?.name, user?.avatar])

  useEffect(() => {
    fetchRating()
  }, [])


  const handleCommentInputChange = (event) => {
    const value = event.target.value;
    setComment(value);
  };

  // Hàm xử lý khi người dùng nhấn vào nút đánh giá
  const handleRateButtonClick = () => {
    if (!user?.id) {
      alert('Xin vui lòng đăng nhập để đánh giá sản phẩm')
      navigate('/sign-in', { state: location?.pathname })
    }
    else {


      if (rating && comment) {
        const data = {

          ratingScore: (product.ratingScore || 0) + Number(rating),
          ratingCount: (product.ratingCount || 0) + 1
        }
        ProductService.updateRatingProduct(idProduct, data)
          .then(result => {
            setProduct(result?.data)
            setProductA(result?.data)
          })
        const dataEvalute = {
          user: user?.id,
          product: idProduct,
          rating: rating,
          comment: comment
        }
        EvaluteService.createEvalute(dataEvalute)
          .then(result => {
            setReviews([...reviews, result?.data])
          })
        setComment()
        setRating(0)

      }
      else {
        alert("Vui lòng điền đủ thông tin")
      }
    }
  };

  useEffect(() => {
    fetchProduct()
  }, [])


  const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })
  const isHidden = (product?.discount === 0) ? true : false






  const handleRatingInputChange = (value) => {
    setRating(value);

  };



  const calculateNumber = (ratingValue) => {
    if (!reviews) return 0;
    const count = reviews.filter(review => review.rating === ratingValue).length;
    return count
  };
  const totalNumberOfRiewview = (ratingValue) => {
    if (!reviews) return 0;
    const count = reviews.filter(review => review.rating === ratingValue).length;
    const sum = count + reviews.length
    return sum
  };
  const calculatePercentage = (ratingValue) => {
    if (!reviews) return 0;
    const count = reviews.filter(review => review.rating === ratingValue).length;
    const percentage = (count / reviews.length) * 100;
    return percentage.toFixed(2);
  };
  return (
    <>
      <div className='py-5 px-5 big ' >
        <div className="container rm py-5">

          <div className="container-fluid  rate-user-table">
            <div className="row">
              <div className="col-3 px-5 my-2" style={{ borderRight: '1px solid black' }}>
                <div className="row mx-5">
                  <strong>  {product?.ratingScore ? (product?.ratingScore / product?.ratingCount).toFixed(1) : 0}/5</strong>
                </div>
                <div className="row">
                  <Rate style={{ marginLeft: "1px" }} allowHalf defaultValue={product?.ratingScore ? (product?.ratingScore / product?.ratingCount).toFixed(1) : 0} value={product?.ratingScore ? (product?.ratingScore / product?.ratingCount).toFixed(1) : 0} />
                </div>
                <div className="row mx-4 my-3">
                  {totalNumberOfRiewview(reviews)} đánh giá
                </div>
              </div>
              <div className="col-9 rate-percent px-5">

                {[5, 4, 3, 2, 1].map(rate => (
                  <div className="row" key={rate}>

                    <div className="col-1"> {rate} <i class="fa-solid fa-star" style={{ color: "#FFD43B", }} ></i></div>
                    <div className="col-8 py-2"><RatingBar percentage={calculatePercentage(rate)} /></div>

                    <div className="col-3 px-3">{calculateNumber(rate)} đánh giá</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='py-2'>  <h2>Đánh giá và nhận xét về {product?.name} </h2></div>
          <div className="container rate-user">
            <div className="row rate-user1">
              <Rate
                onChange={handleRatingInputChange}
                value={rating}
                style={{ marginBottom: '10px' }}
              />


            </div>
            <div className="row">
              <Input
                placeholder="Đánh giá về sản phẩm"
                onChange={handleCommentInputChange}
                value={comment}
                style={{ marginBottom: '10px' }}
              />
            </div>
            <div className="row row-bt">
              <Button type="primary" onClick={handleRateButtonClick}>
                Đánh giá
              </Button>
            </div>
          </div>



          <div className="row">

            {reviews?.map((review, index) => (
              <div key={index} className='row ra-cm'>
                <div className="row ">
                  <div className="col col-avatar">
                    {review?.user?.avatar ? (
                      <img src={review?.user?.avatar} alt="avatar" style={{

                        width: '5%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} />
                    ) : (
                      <UserOutlined style={{ fontSize: '30px' }} />
                    )}

                    <div className=' col px-2'><strong>{review?.user?.name}</strong></div>
                    <div className="col-2">
                      {formatDate(review?.createdAt)}
                    </div>
                  </div>

                </div>
                <div className="row py-2 px-3 ">

                  <Rate disabled value={review.rating} />
                  <p>{review.comment}</p>
                </div>

              </div>
            ))}
          </div>


        </div>
      </div>
    </>
  )
}

export default RatingComponent