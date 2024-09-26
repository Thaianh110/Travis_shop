import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperCountOrder, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';


const OrderSucess = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const priceMemo = useMemo(() => {
    const result = state.orders?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [state.orders])

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 500000) {
      return 5000
    } else if (priceMemo >= 200000) {
      return 10000
    } else {
      return 20000
    }
  }, [priceMemo])
  return (
    <>
      <div style={{ marginLeft: '20px' }}>
        <h3 style={{ margin: "10px" }}><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Đặt hàng thành công</h3>
      </div>
      <div style={{ background: '#f5f5fa', with: '100%', paddingTop: "12px" }}>
        <Loading isLoading={false}>
          <div style={{ height: '100%', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <WrapperContainer>
                <WrapperItemOrderInfo>

                  {state.orders?.map((order) => {
                    return (
                      <WrapperItemOrder key={order?.name}>
                        <div style={{ width: '50%', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <img src={order.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                          <div style={{
                            width: 260,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: '500'
                          }}>{order?.name}</div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ marginRight: "80px" }}>
                            <span style={{ fontSize: '13px', color: '#242424' }}>Giá tiền: {convertPrice(order?.price)}</span>
                            <br></br>
                            <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                          </span>
                          <span>
                            <span style={{ margin: "0 20px", fontSize: '13px', color: '#242424' }}>Giảm giá: {convertPrice(order?.price * order?.discount / 100 * order.amount)}</span>
                            <br></br>
                            <span style={{ margin: "0 20px", fontSize: '13px', color: '#242424' }}>Thành tiền: {convertPrice((order?.price - (order?.price * order?.discount / 100 * order.amount)) * order?.amount)}</span>
                          </span>
                        </div>
                      </WrapperItemOrder>
                    )
                  })}
                </WrapperItemOrderInfo>
                <div style={{ margin: "10px 0" }}>
                  <WrapperInfo>

                    <span style={{ display: "flex", justifyContent: "center", fontSize: '14px' }}>Phí giao hàng: {convertPrice(diliveryPriceMemo)}</span>
                    <br></br>
                    <span style={{ display: "flex", justifyContent: "center", fontSize: '16px', color: 'red' }}>Tổng tiền: {convertPrice(state?.totalPriceMemo)}</span>

                  </WrapperInfo>
                </div>
                <WrapperInfo>
                  <div>
                    <Lable>Phương thức giao hàng</Lable>
                    <WrapperValue>
                      <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                    </WrapperValue>
                  </div>
                </WrapperInfo>
                <div style={{ margin: "10px 0" }}>
                  <WrapperInfo>
                    <div>
                      <Lable>Phương thức thanh toán</Lable>
                      <WrapperValue>
                        {orderContant.payment[state?.payment]}
                      </WrapperValue>
                    </div>
                  </WrapperInfo>
                </div>
              </WrapperContainer>
            </div>
          </div>
        </Loading>
      </div>
    </>
  )
}

export default OrderSucess