import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { getItem } from '../../utils';
import { StockOutlined, UserOutlined, AppstoreOutlined, ShoppingCartOutlined, CalendarOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderCompoent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import BookingAdmin from '../../components/BookingAdmin/BookingAdmin'
import StatisticsAdmin from '../../components/AdminStatistics/AdminStatistics'
import * as OrderService from '../../services/OrderService'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import * as BookingService from '../../services/BookingService'


import CustomizedContent from './components/CustomizedContent';
import { useSelector } from 'react-redux';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import Loading from '../../components/LoadingComponent/Loading';

const AdminPage = () => {
  const user = useSelector((state) => state?.user)

  const items = [
    getItem('Người dùng', 'users', <UserOutlined />),
    getItem('Sản phẩm', 'products', <AppstoreOutlined />),
    getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
    getItem('Đặt lịch', 'bookings', <CalendarOutlined />),
    getItem('Thống kê', 'statistics', <StockOutlined />)
  ];

  const [keySelected, setKeySelected] = useState('');
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return { data: res?.data, key: 'orders' }
  }

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    console.log('res1', res)
    return { data: res?.data, key: 'products' }
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    console.log('res', res)
    return { data: res?.data, key: 'users' }
  }
  const getAllBooking = async () => {
    const res = await BookingService.getAllBooking()
    console.log('res', res)
    return { data: res?.data, key: 'bookings' }
  }

  const queries = useQueries({
    queries: [
      { queryKey: ['products'], queryFn: getAllProducts, staleTime: 1000 },
      { queryKey: ['users'], queryFn: getAllUsers, staleTime: 1000 },
      { queryKey: ['orders'], queryFn: getAllOrder, staleTime: 1000 },
      { queryKey: ['bookings'], queryFn: getAllBooking, staleTime: 1000 }
    ]
  })
  const memoCount = useMemo(() => {
    const result = {}
    try {
      if (queries) {
        queries.forEach((query) => {
          result[query?.data?.key] = query?.data?.data?.length
        })
      }
      return result
    } catch (error) {
      return result
    }
  }, [queries])
  const COLORS = {
    users: ['#e66465', '#9198e5'],
    products: ['#a8c0ff', '#3f2b96'],
    orders: ['#11998e', '#38ef7d'],
    bookings: ['#5BA8A0', '#CBE5AE'],
    statistics: ['#5BA8A0', '#CBE5AE']
  };

  const renderPage = (key) => {
    switch (key) {
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      case 'orders':
        return (
          <OrderAdmin />
        )
      case 'bookings':
        return (
          <BookingAdmin />
        )
      case 'statistics':
        return (
          <StatisticsAdmin />
        )
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart isHiddenCalendar />
      <div style={{ display: 'flex', overflowX: 'hidden', }}>
        <Menu
          mode="inline"
          style={{
            width: "256px",
            boxShadow: '1px 1px 2px #ccc',

          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ padding: '15px 0 15px 40px', width: "80%" }}>
          <Loading isLoading={memoCount && Object.keys(memoCount) && Object.keys(memoCount).length !== 4}>
            {!keySelected && (
              <CustomizedContent data={memoCount} colors={COLORS} setKeySelected={setKeySelected} />
            )}
          </Loading>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage