import React from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

import './dichvu.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, useNavigate } from 'react-router-dom';


const DichvuPage = () => {
    const navigate = useNavigate()
    const handleBooking = () => {
        navigate('/booking')
    }
    return (
        <>
            <div style={{ marginLeft: '20px' }}>
                <h3 style={{ margin: "10px" }}><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Dịch vụ</h3>
            </div>

            <div className='big-img'>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            borderRadius: "50px",
                            background: 'rgb(255, 57, 69)',
                            height: '60px',
                            width: '120px',
                            border: 'none',

                        }}
                        onClick={handleBooking}
                        textbutton={'Đặt lịch ngay'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </div>
                <div className='anh'>
                    <h1>Bảng Giá Travis BarberShop</h1>
                    <img src="./bang-gia-6226.png" alt="" srcset="" style={{ width: '100%' }} />
                </div>
                <div className='anh-1'>
                    <img src="./bg1.png" alt="" srcset="" style={{ width: '100%' }} />
                    <img src="./bg2.png" alt="" srcset="" style={{ width: '100%' }} />
                </div>
            </div>
            <div className='container'>
 <div className="row">
 <img src="./a.webp" alt="" srcset="" />
 </div>
 <div className="row">
 <img src="./b.webp" alt="" srcset="" />
 </div>
 <div className="row" >
 <img src="./c.webp" alt="" srcset=""  />
 </div>
</div>
        </>
    )
    


}
export default DichvuPage