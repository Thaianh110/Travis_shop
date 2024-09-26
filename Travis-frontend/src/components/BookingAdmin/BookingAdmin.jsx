import { Button, Form, Space } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as BookingService from '../../services/BookingService'
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, DeleteFilled, EditFilled, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { format, addDays } from "date-fns"

const BookingAdmin = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const formatDate = (bookingDate) => {
    return format(new Date(bookingDate), "dd/MM/yyyy")
  }
  const formatTime = (bookingTime) => {
    // Chia chuỗi thời gian thành giờ và phút
    const [hour, minute] = bookingTime.split(":");

    // Chuyển đổi thành một số nguyên duy nhất
    const timeInt = parseInt(hour, 10) * 100 + parseInt(minute, 10);
    return timeInt;
  }

  function convertDateFormat(inputDate) {
    const parts = inputDate.split('/');
    const formattedDate = parts.reverse().join('-');
    return formattedDate;
  }

  const [stateBookingDetails, setStateBookingDetails] = useState({
    bookingName: '',
    bookingEmail: '',
    bookingPhone: '',
    bookingDate: '',
    bookingTime: ''
  })

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = BookingService.updateBooking(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
      } = data
      const res = BookingService.deleteManyBooking(
        ids,
        token)
      return res
    },
  )

  const handleDelteManyBooking = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryClient.invalidateQueries(['users'])
      }
    })
  }

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = BookingService.deleteBooking(
        id,
        token)
      return res
    },
  )

  const fetchGetDetailsBooking = async (rowSelected) => {
    const res = await BookingService.getDetailsBooking(rowSelected)
    if (res?.data) {
      setStateBookingDetails({
        bookingName: res?.data?.bookingName,
        bookingEmail: res?.data?.bookingEmail,
        bookingPhone: res?.data?.bookingPhone,
        bookingDate: res?.data?.bookingDate,
        bookingTime: res.data?.bookingTime
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateBookingDetails)
  }, [form, stateBookingDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsBooking(rowSelected)
      setIsLoadingUpdate(false)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsBooking = () => {
    setIsOpenDrawer(true)
  }

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const queryClient = useQueryClient()
  const bookings = queryClient.getQueryData(['bookings'])
  const isFetchingBooking = useIsFetching(['bookings'])
  const renderAction = () => {
    return (
      <div>
        <DeleteFilled style={{ color: 'blue', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditFilled style={{ color: 'violet', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsBooking} />
      </div>
    )
  }

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
      record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
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
      title: 'Name',
      dataIndex: 'bookingName',
      sorter: (a, b) => a.bookingName?.length - b.bookingName?.length,
      ...getColumnSearchProps('bookingName')
    },
    {
      title: 'Email',
      dataIndex: 'bookingEmail',
      sorter: (a, b) => a.bookingEmail?.length - b.bookingEmail?.length,
      ...getColumnSearchProps('bookingEmail')
    },
    {
      title: 'Phone',
      dataIndex: 'bookingPhone',
      sorter: (a, b) => a.bookingPhone?.length - b.bookingPhone?.length,
      ...getColumnSearchProps('bookingPhone')
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      render: (bookingDate) => formatDate(bookingDate),
      sorter: (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate),
      filters: [

        {
          dataIndex: 'bookingDate',
          text: 'hôm nay',
          value: 'curdate',
        },
        {
          dataIndex: 'bookingDate',
          text: 'ngày mai',
          value: 'nextdate',
        },
        {
          dataIndex: 'bookingDate',
          text: 'ngày kia',
          value: 'nextTomorrowdate',
        }
      ],
      onFilter: (value, record) => {
        if (value === "curdate") {
          const currentDate = format(new Date(), 'dd/MM/yyyy');
          return record.bookingDate == convertDateFormat(currentDate);
        } else if (value === 'nextdate') {
          const today = new Date();
          const tomorrow = addDays(today, 1)
          const formatTomorrow = format(tomorrow, 'dd/MM/yyyy');
          return record.bookingDate == convertDateFormat(formatTomorrow);
        } else {
          const today = new Date();
          const nexttomorrow = addDays(today, 2)
          const formatnextTomorrow = format(nexttomorrow, 'dd/MM/yyyy');
          return record.bookingDate == convertDateFormat(formatnextTomorrow)
        }
      },
      // filterSearch:(value,dataIndex,record) => {
      //   return record['dataIndex'] && record['dataIndex'].toString().toLowerCase().includes(value.toLowerCase())
      // }

      // ...getColumnSearchProps('bookingDate')
    },
    {
      title: 'Time',
      dataIndex: "bookingTime",
      sorter: (a, b) => {
        const dateA = new Date(a.bookingDate);
        const dateB = new Date(b.bookingDate);
        // So sánh ngày đặt lịch
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        } else {
          const timeA = formatTime(a.bookingTime);
          const timeB = formatTime(b.bookingTime);
          return timeA - timeB;
        }
      }
      ,
      ...getColumnSearchProps('bookingTime')
    },
    {
      title: 'Code',
      dataIndex: 'bookingCode',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = bookings?.data?.length > 0 && bookings?.data?.map((booking) => {
    return { ...booking, key: booking._id }
  })

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateBookingDetails({
      bookingName: '',
      bookingEmail: '',
      bookingPhone: '',
      bookingDate: '',
      bookingTime: '',

    })
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteBooking = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryClient.invalidateQueries(['bookings'])
      }
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateBookingDetails({
      ...stateBookingDetails,
      [e.target.name]: e.target.value
    })
  }

  const onUpdateBooking = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateBookingDetails }, {
      onSettled: () => {
        queryClient.invalidateQueries(['bookings'])
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý đặt lịch</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDelteMany={handleDelteManyBooking} titleButton="Export PDF" columns={columns} isLoading={isFetchingBooking} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          };
        }} />
      </div>
      <DrawerComponent title='Chi tiết đặt lịch' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateBooking}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="bookingName"
              rules={[{ required: true, message: 'Please input your booking name!' }]}
            >
              <InputComponent value={stateBookingDetails['bookingName']} onChange={handleOnchangeDetails} name="bookingName" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="bookingEmail"
              rules={[{ required: true, message: 'Please input your booking email!' }]}
            >
              <InputComponent value={stateBookingDetails['bookingEmail']} onChange={handleOnchangeDetails} name="bookingEmail" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="bookingPhone"
              rules={[{ required: true, message: 'Please input your booking  phone!' }]}
            >
              <InputComponent value={stateBookingDetails.bookingPhone} onChange={handleOnchangeDetails} name="bookingPhone" />
            </Form.Item>

            <Form.Item
              label="Date"
              name="bookingDate"
              rules={[{ required: true, message: 'Please input your booking Date!' }]}
            >
              <InputComponent value={stateBookingDetails.bookingDate} onChange={handleOnchangeDetails} name="bookingDate" />
            </Form.Item>

            <Form.Item
              label="Time"
              name="bookingTime"
              rules={[{ required: true, message: 'Please input your booking Time' }]}
            >
              <InputComponent value={stateBookingDetails.bookingTime} onChange={handleOnchangeDetails} name="bookingTime" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent title="Xóa phiên đặt lịch" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteBooking}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa phiên đặt lịch này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default BookingAdmin