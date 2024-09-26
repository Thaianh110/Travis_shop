import { Button, Form, Space } from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { convertPrice, getBase64 } from '../../utils'
import { format, parseISO } from "date-fns"
import { useMutationHooks } from '../../hooks/useMutationHook'
import ModalComponent from '../ModalComponent/ModalComponent'

// import DrawerComponent from '../DrawerComponent/DrawerComponent'
// import Loading from '../LoadingComponent/Loading'
// import ModalComponent from '../ModalComponent/ModalComponent'
// import { useEffect } from 'react'
// import * as message from '../Message/Message'

import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { DeleteOutlined, EditFilled, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'
import * as message from '../../components/Message/Message'
const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  // const [isSuccessUpdated, setIsSuccessUpdated] = useState()

  const inittial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: '',
  })
  const [form] = Form.useForm();
  const [stateOrderDetails, setStateOrderDetails] = useState(inittial())
  const formatDate = (createdAt) => {
    // console.log(createdAt)
    // const parsedDate = parseISO(createdAt)
    const [year, month, day] = createdAt.toString().split('T')[0].split('-').map(Number);
    return format(new Date(year, month - 1, day), 'dd/MM/yyyy')
    // return format(parsedDate,"dd/MM/yyyy")
  }

  const renderAction = () => {
    return (
      <div>

        <EditFilled style={{ color: 'violet', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  const fetchGetDetailsProduct = async (rowSelected) => {

    const res = await OrderService.getDetailsOrders(rowSelected)
    console.log("res", res.data);
    if (res?.data) {
      setStateOrderDetails({
        name: res?.data?.shippingAddress.fullName,
        totalPrice: res?.data?.totalPrice,
        isDelivered: res?.data?.isDelivered,
        isPaid: res?.data?.isPaid,
        phone: res?.data?.shippingAddress.phone,
        address: res?.data?.shippingAddress.address,
        city: res?.data?.shippingAddress.city,

      })

    }

  }

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }


  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,

        ...rests } = data
      const res = OrderService.updateOrder(
        id,

        { ...rests })
      return res
    },
  )

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateOrderDetails({
      name: "",
      totalPrice: "",
      isDelivered: "",
      isPaid: "",
      phone: "",
      address: "",
      city: ""
    })
    form.resetFields()
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsProduct(rowSelected)

    }
  }, [rowSelected, isOpenDrawer])

  const onUpdateOrder = () => {
    mutationUpdate.mutate({ id: rowSelected, ...stateOrderDetails }, {
      onSettled: () => {
        queryOrder.refetch()
      }
    })

  }
  const handleOnchangeDetails = (e) => {
    setStateOrderDetails({
      ...stateOrderDetails,
      [e.target.name]: e.target.value === 'true'
    })
  }

  function convertDateFormat(inputDate) {
    const parts = inputDate.split('/');
    const formattedDate = parts.reverse().join('-');
    return formattedDate;
  }

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }
  const formatPrice = (totalPrice) => {
    const numberString = totalPrice.replace(/\D/g, "");
    const number = parseFloat(numberString);
    return number;
  }


  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (dataIndex === 'totalPrice') {
        const formatInputValue = formatPrice(value).toString();
        const formatRecord = formatPrice(record[dataIndex])
        return formatRecord && formatRecord.toString().toLowerCase().includes(formatInputValue.toLowerCase())
      }
      else if (dataIndex === "timeOrder") {
        const formatinputTime = convertDateFormat(value)
        const formatRecord = formatDate(record[dataIndex])
        return formatRecord && formatRecord.toString().toLowerCase().includes(formatinputTime.toLowerCase())
      } else {
        return record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      }


    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName?.length - b.userName?.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address?.length - b.address?.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Paided',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Shipped',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => {
        return formatPrice(a.totalPrice) - formatPrice(b.totalPrice)
      },
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'TimeOrder',
      dataIndex: 'timeOrder',
      render: (timeOrder) => formatDate(timeOrder),
      sorter: (a, b) => new Date(a.timeOrder) - new Date(b.timeOrder),
      ...getColumnSearchProps('timeOrder')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  useEffect(() => {
    if (isSuccessUpdated) {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated, isErrorUpdated])


  const dataTable = orders?.data?.length && orders?.data?.map((order) => {

    return { ...order, key: order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod], isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice), timeOrder: order?.createdAt }
  })

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      {/* <div style={{ height: 200, width: 200 }}>
        <PieChartComponent data={orders?.data} />
      </div> */}
      <div style={{ marginTop: '20px' }}>
        <TableComponent titleButton="Export Excel" displayButtonPrint={true} noDelete={false} columns={columns} isLoading={isLoadingOrders} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)

            }
          };
        }} />
      </div>
      <ModalComponent forceRender title="Chỉnh sửa đơn hàng" open={isOpenDrawer} onCancel={handleCloseDrawer} footer={null} >
        <div style={{ fontSize: "15px" }}>
          <div >
            {console.log("stateOrderDetails", stateOrderDetails)}
            <p>Tên người đặt: {stateOrderDetails?.name}</p>
            <p>Số điện thoại: {stateOrderDetails?.phone}</p>
            <p>Địa chỉ: {stateOrderDetails?.address} {stateOrderDetails?.city}</p>
          </div>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onUpdateOrder}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Đã trả"
              name="isPaid"
            // rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <input style={{ marginLeft: "30px" }} type="radio" name="isPaid" value={true} checked={stateOrderDetails?.isPaid === true} onChange={handleOnchangeDetails}></input> True
              <input style={{ marginLeft: "30px" }} type="radio" name="isPaid" value={false} checked={stateOrderDetails?.isPaid === false} onChange={handleOnchangeDetails}></input> False
              {/* <InputComponent value={stateOrderDetails.isPaid} onChange={handleOnchangeDetails} name="isPaid" /> */}
            </Form.Item>
            <Form.Item
              label="Đã giao"
              name="isDelivered"
            // rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <input style={{ marginLeft: "30px" }} type="radio" name="isDelivered" value={true} checked={stateOrderDetails?.isDelivered === true} onChange={handleOnchangeDetails}></input> True
              <input style={{ marginLeft: "30px" }} type="radio" name="isDelivered" value={false} checked={stateOrderDetails?.isDelivered === false} onChange={handleOnchangeDetails}></input> False
              {/* <InputComponent value={stateOrderDetails.isPaid} onChange={handleOnchangeDetails} name="isPaid" /> */}
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </div>


      </ModalComponent>
    </div>
  )
}

export default OrderAdmin