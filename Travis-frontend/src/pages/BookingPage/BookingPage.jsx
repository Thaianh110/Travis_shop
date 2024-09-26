import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperHeaderText, WrapperClosed, WrapperLabel, WrapperInput, WrapperContainerLeft, WrapperContainerRight } from '../BookingPage/style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as BookingService from '../../services/BookingService'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import imageLogo from '../../assets/images/logo.png'
import * as message from '../../components/Message/Message'
import Loading from '../../components/LoadingComponent/Loading';
import 'react-datepicker/dist/react-datepicker.css';
// import { WrapperContainerRight } from '../SignUpPage/style';
import { Image } from 'antd';



const BookingPage = () => {
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const currentDate = new Date();
  const defaultDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  const [bookingDate, setBookingDate] = useState(defaultDate);


  console.log('bookingDate', bookingDate, typeof bookingDate)
  const [bookingTime, setBookingTime] = useState('');
  const navigate = useNavigate()
  const mutation = useMutationHooks(
    (data) => BookingService.createBooking(data)
  )


  //  useEffect(() => {
  //     const currentDate = new Date();
  //     const formatDate = currentDate.toLocaleDateString('en-GB');
  //     console.log("formatdate",formatDate)
  //     setBookingDate(formatDate);
  //  },[])


  const { data, isLoading } = mutation;
  useEffect(() => {
    if (data?.status === 'OK') {
      message.success("Bạn đã đặt lịch thành công")
      navigate('/');
    } else {
    }
  },)

  const handleOnchangeEmail = (value) => {
    setBookingEmail(value)
  }

  const handleOnchangeName = (value) => {
    setBookingName(value)
  }
  const handleOnchangePhone = (value) => {
    setBookingPhone(value)
  }
  const handleOnchangeDate = (value) => {
    setBookingDate(value)
  }
  const handleOnchangeTime = (value) => {
    setBookingTime(value)
  }
  const handleBooking = (value) => {
    mutation.mutate({
      bookingName,
      bookingEmail,
      bookingPhone,
      bookingDate,
      bookingTime
    })
  }


  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: 'rgba(0, 0, 0, 0.53)', marginTop: "1px", fontSize: "20px", height: "100%", padding: "0 0 80px" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "6px", border: "1px solid #fff", marginTop: "40px", boxSizing: 'border-box', display: "flex" }}>
        <WrapperContainerLeft>
          {/* <WrapperClosed >
          <CloseCircleOutlined onClick={() => { navigate("/") }} />
        </WrapperClosed> */}
          <WrapperHeaderText>Đặt lịch cắt tóc</WrapperHeaderText>
          <div style={{ padding: "10px" }}>
            <WrapperInput>
              <WrapperLabel>Họ và tên</WrapperLabel>
              <InputForm style={{ marginTop: "3px" }} placeholder="Nguyễn Thái Anh"
                value={bookingName}
                onChange={handleOnchangeName}
              />

            </WrapperInput>
            <WrapperInput>
              <WrapperLabel>Email của bạn</WrapperLabel>
              <InputForm style={{ marginTop: "3px" }} placeholder="thaianh110@gmail.com"
                value={bookingEmail}
                onChange={handleOnchangeEmail}
              />
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel>Số điện thoại</WrapperLabel>
              <InputForm style={{ margin: "2px 0 10px" }} placeholder="Nhập số điện thoại" value={bookingPhone} onChange={handleOnchangePhone} />
            </WrapperInput>
            <WrapperInput>
              <WrapperLabel>Chọn ngày</WrapperLabel>
              <InputForm
                style={{ margin: "2px 0 10px" }}
                // onChange={(e) =>
                //   setBookingDate(e.target.value)}
                onChange={handleOnchangeDate}
                type="date"
                value={bookingDate}
              />

            </WrapperInput>
            <WrapperInput>
              <WrapperLabel>chọn giờ</WrapperLabel>
              <InputForm style={{ margin: "2px 0 10px" }} type="time" value={bookingTime} min="08:00" max="17:00" onChange={handleOnchangeTime} />
            </WrapperInput>

            {data?.status === 'ERR' && <span style={{ marginLeft: "10px", fontSize: "12px", color: "red" }}>{data?.message}</span>}

            <Loading isLoading={isLoading}>
              <ButtonComponent
                disabled={!bookingName.length || !bookingEmail.length || !bookingPhone.length || !bookingTime}
                onClick={handleBooking}
                size={40}
                styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  margin: '26px 0 10px'
                }}
                textbutton={'Đặt lịch'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>

            </Loading>

          </div>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <WrapperClosed >
            <CloseCircleOutlined onClick={() => { navigate("/") }} />
          </WrapperClosed>
          <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
          <h4>Đặt lịch với Travis Barbershop</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}


export default BookingPage