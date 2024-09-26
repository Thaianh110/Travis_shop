import React from 'react'
import { convertPrice } from '../../utils'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import * as OrderService from '../../services/OrderService'
import { useState, useEffect } from 'react'
import { Button, Form, Select, DatePicker, Space } from 'antd'
import ModalComponent from '../ModalComponent/ModalComponent'
const { Option } = Select;
const { MonthPicker } = DatePicker;

const AdminUser = () => {
    const user = useSelector((state) => state?.user)
    const [revenue, setRevenue] = useState(0);
    const [revenuePaid, setRevenuePaid] = useState(0);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [emptyProducts, setEmptyProducts] = useState([]);
    const [productsRunningOutOfStock, setProductsRunningOutOfStock] = useState([]);
    const [productInventory, setProductInventory] = useState({});
    const [form] = Form.useForm();
    const [isModalOpenTopSelling, setIsModalOpenTopSelling] = useState(false);
    const [isModalOpenLittle, setIsModalOpenLittle] = useState(false);
    const [isModalOpenEmpty, setIsModalOpenEmpty] = useState(false);
    const [isModalOpenRemain, setIsModalOpenRemain] = useState(false);
    const [isModalOpenDay, setIsModalOpenDay] = useState(false);

    const [selectedPeriod, setSelectedPeriod] = useState('day');
    const [selectedDate, setSelectedDate] = useState(null); // State variable to store selected date
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [revenueData, setRevenueData] = useState({});
    const [revenueDataMonth, setRevenueDataMonth] = useState({});
    const [revenueDataYear, setRevenueDataYear] = useState({});
    const [revenueDataYearIsPaid, setRevenueDataYearIsPaid] = useState(0);
    const [revenueDataIsPaid, setRevenueDataIsPaid] = useState(0);
    const [revenueDataMonthIsPaid, setRevenueDataMonthIsPaid] = useState(0);
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const { isLoading: isLoadingProducts, data: products } = queryProduct





    const handleCancel = () => {
        setIsModalOpenTopSelling(false);
        setIsModalOpenLittle(false);
        setIsModalOpenRemain(false);
        setIsModalOpenEmpty(false)
        setIsModalOpenDay(false)

        form.resetFields()
    };

    useEffect(() => {
        if (orders) {
            // Calculate total revenue
            const totalRevenue = orders.data.reduce((acc, order) => acc + order.totalPrice, 0);
            setRevenue(totalRevenue);
            const paidRevenue = orders.data
                .filter(order => order.isPaid) // Filter orders where isPaid is true
                .reduce((acc, order) => acc + order.totalPrice, 0);
            setRevenuePaid(paidRevenue);
        }
    }, [orders]);


    useEffect(() => {
        if (products && isModalOpenTopSelling) {
            const sortedProducts = [...products.data]
                .sort((a, b) => (b.selled || 0) - (a.selled || 0)) // Sort products by the quantity sold, defaulting to 0 if selled is undefined
                .slice(0, 10); // Get top 10 selling products

            setTopSellingProducts(sortedProducts);

        }
    }, [products, isModalOpenTopSelling]);

    useEffect(() => {
        if (products && isModalOpenLittle) {
            const sortedProducts = [...products.data]
                .filter(product => product.countInStock <= 10 && product.countInStock >= 1) // Filter products with countInStock less than or equal to 5
                .sort((a, b) => a.countInStock - b.countInStock); // Sort products by countInStock in ascending order

            setProductsRunningOutOfStock(sortedProducts);
        }
    }, [products, isModalOpenLittle]);

    useEffect(() => {
        if (products && isModalOpenEmpty) {
            const emptyProducts = [...products.data]
                .filter(product => product.countInStock === 0) // Filter products with countInStock less than or equal to 5
            // Sort products by countInStock in ascending order

            setEmptyProducts(emptyProducts);
        }
    }, [products, isModalOpenEmpty]);

    useEffect(() => {
        if (products) {
            const productInventoryMap = {};

            products.data.forEach(product => {
                if (productInventoryMap[product.category]) {
                    productInventoryMap[product.category] += product.countInStock;
                } else {
                    productInventoryMap[product.category] = product.countInStock;
                }
            });

            setProductInventory(productInventoryMap);
        }
    }, [products]);

    useEffect(() => {
        if (orders && isModalOpenDay) {
            const revenueDataMap = {};
            var revenueDataMapIsPaid = 0
            orders.data.forEach(order => {
                if (order.createdAt) {
                    const createdDate = new Date(order.createdAt);
                    const key = selectedDate ? createdDate.toISOString().split('T')[0] : `${createdDate.getFullYear()}-${createdDate.getMonth() + 1}`;
                    if (selectedDate && key === selectedDate && order.isPaid) {
                        revenueDataMap[key] = (revenueDataMap[key] || 0) + order.totalPrice;
                        revenueDataMapIsPaid = (revenueDataMapIsPaid || 0) + order.totalPrice
                    }
                    else if (selectedDate && key === selectedDate) {
                        revenueDataMap[key] = (revenueDataMap[key] || 0) + order.totalPrice;
                    }
                }
            });
            setRevenueData(revenueDataMap);
            setRevenueDataIsPaid(revenueDataMapIsPaid)
        }
    }, [orders, selectedDate, isModalOpenDay]);

    const handleDateChange = (date) => {
        setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
    };


    useEffect(() => {
        if (orders && isModalOpenDay) {
            const revenueDataMap = {};
            var revenueDataMapIsPaid = 0
            orders.data.forEach(order => {
                if (order.createdAt) {
                    const createdDate = new Date(order.createdAt);
                    const key = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}`;
                    if (key === selectedMonth && order.isPaid) {
                        revenueDataMap[key] = (revenueDataMap[key] || 0) + order.totalPrice;
                        revenueDataMapIsPaid = (revenueDataMapIsPaid || 0) + order.totalPrice
                    }
                    else if (key === selectedMonth) {
                        revenueDataMap[key] = (revenueDataMap[key] || 0) + order.totalPrice;
                    }
                }
            });
            setRevenueDataMonth(revenueDataMap);
            setRevenueDataMonthIsPaid(revenueDataMapIsPaid)
        }
    }, [orders, selectedMonth]);

    const handleMonthChange = (date, dateString) => {
        setSelectedMonth(dateString || null);
    };

    useEffect(() => {
        if (orders && isModalOpenDay) {
            const revenueDataMap = {};
            var revenueDataMapIsPaid = 0
            orders.data.forEach(order => {
                if (order.createdAt) {
                    const createdDate = new Date(order.createdAt);
                    const key = createdDate.getFullYear().toString(); // Chỉ lấy năm từ thời gian tạo đơn hàng
                    if (key === selectedYear && order.isPaid) {
                        revenueDataMap[key] = (revenueDataMap[key] || 0) + order.totalPrice;
                        revenueDataMapIsPaid = (revenueDataMapIsPaid || 0) + order.totalPrice;
                    }
                    else if (key === selectedYear) {
                        revenueDataMap[key] = (revenueDataMap[key] || 0) + order.totalPrice;
                    }

                }
            });
            setRevenueDataYear(revenueDataMap); // Cập nhật state với doanh thu theo năm
            setRevenueDataYearIsPaid(revenueDataMapIsPaid)
        }
    }, [orders, selectedYear]);

    const handleYearChange = (date, dateString) => {
        setSelectedYear(dateString || null); // Xử lý sự kiện khi năm được chọn
    };
    return (
        <div>
            <h3>Thống kê</h3>
            <h4 style={{ marginTop: "20px" }}>Thống kê sản phẩm</h4>
            <div style={{ display: "flex" }}>
                <div style={{ marginTop: '10px', marginRight: "20px" }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'solid' }} onClick={() => setIsModalOpenTopSelling(true)}>Sản phẩm bán chạy</Button>
                </div>
                <div style={{ marginTop: '10px', marginRight: "20px" }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'solid' }} onClick={() => setIsModalOpenLittle(true)}>Sản phẩm sắp hết</Button>
                </div>
                <div style={{ marginTop: '10px', marginRight: "20px" }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'solid' }} onClick={() => setIsModalOpenEmpty(true)}>Sản phẩm đã hết</Button>
                </div>
                <div style={{ marginTop: '10px', marginRight: "20px" }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'solid' }} onClick={() => setIsModalOpenRemain(true)}>Tất cả sản phẩm</Button>
                </div>
            </div>
            <h4 style={{ marginTop: "20px" }}>Thống kê doanh thu</h4>
            <div style={{ display: "flex" }}>
                <div style={{ marginTop: '10px', marginRight: "20px" }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'solid' }} onClick={() => setIsModalOpenDay(true)}>Thống kê doanh thu</Button>
                </div>

            </div>
            <ModalComponent forceRender title="Các sản phẩm bán chạy" open={isModalOpenTopSelling} onCancel={handleCancel} footer={null}>
                <tr>
                    <th style={{ width: "300px" }}>Tên sản phẩm</th>
                    <th style={{ width: "100px" }}>Đã bán</th>
                    <th>Còn lại</th>
                </tr>
                {topSellingProducts.map(product => (
                    <tr key={product._id}>
                        <td style={{ width: "300px" }}> {product.name}</td>
                        <td style={{ width: "100px" }}> {product.selled}</td>
                        <td>{product.countInStock}</td>
                    </tr>
                ))}

            </ModalComponent>
            <ModalComponent forceRender title="Các sản phẩm sắp hết hàng" open={isModalOpenLittle} onCancel={handleCancel} footer={null}>
                <tr>
                    <th style={{ width: "300px" }}>Tên sản phẩm</th>
                    <th style={{ width: "100px" }}>Còn lại</th>
                    <th>Đã bán</th>
                </tr>
                {productsRunningOutOfStock.map(product => (
                    <tr key={product._id}>
                        <td style={{ width: "300px" }}> {product.name}</td>
                        <td style={{ width: "100px" }}> {product.countInStock}</td>
                        <td>{product.selled}</td>
                    </tr>
                ))}

            </ModalComponent>
            <ModalComponent forceRender title="Các sản phẩm đã hết hàng" open={isModalOpenEmpty} onCancel={handleCancel} footer={null}>
                <tr>
                    <th style={{ width: "300px" }}>Tên sản phẩm</th>
                    <th style={{ width: "100px" }}>Còn lại</th>
                    <th>Đã bán</th>
                </tr>
                {emptyProducts.map(product => (
                    <tr key={product._id}>
                        <td style={{ width: "300px" }}> {product.name}</td>
                        <td style={{ width: "100px" }}> {product.countInStock}</td>
                        <td>{product.selled}</td>
                    </tr>
                ))}

            </ModalComponent>
            <ModalComponent forceRender title="Tất cả các sảm phẩm" open={isModalOpenRemain} onCancel={handleCancel} footer={null}>
                <tr>
                    <th style={{ width: "300px" }}>Tên sản phẩm</th>
                    <th style={{ width: "100px" }}> Còn lại</th>
                    <th>Đã bán</th>
                </tr>
                {products && products.data.map(product => (
                    <tr key={product._id}>
                        <td style={{ width: "300px" }}> {product.name}</td>
                        <td style={{ width: "100px" }}> {product.countInStock}</td>
                        <td>{product.selled}</td>
                    </tr>
                ))}

            </ModalComponent>
            <ModalComponent forceRender title="Thống kê doanh thu" open={isModalOpenDay} onCancel={handleCancel} footer={null}>
                <div>
                    <h4>Chọn ngày</h4>
                    <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "20px" }}>
                            <Space>
                                <DatePicker onChange={handleDateChange} />
                            </Space>
                        </div>
                        <div style={{ height: "120px" }}>
                            {Object.entries(revenueData).map(([period, revenue]) => (
                                <div key={period}>
                                    <p style={{ fontWeight: "500", marginBottom: "10px" }}>Doanh thu ngày {period}: </p>
                                    <p>Tạm tính: {convertPrice(revenue)}</p>
                                    <p>Đã thu: {convertPrice(revenueDataIsPaid)}</p>
                                    <p>Chưa thu: {convertPrice(revenue - revenueDataIsPaid)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <h4>Chọn tháng</h4>
                    <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "20px" }}>
                            <Space>
                                <DatePicker picker="month" onChange={handleMonthChange} />
                            </Space>
                        </div>
                        <div style={{ height: "120px" }}>
                            {Object.entries(revenueDataMonth).map(([period, revenue]) => (
                                <div key={period}>
                                    <p style={{ fontWeight: "500", marginBottom: "10px" }}>Doanh thu tháng {period}: </p>
                                    <p>Tạm tính: {convertPrice(revenue)}</p>
                                    <p>Đã thu: {convertPrice(revenueDataMonthIsPaid)}</p>
                                    <p>Chưa thu: {convertPrice(revenue - revenueDataMonthIsPaid)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Chọn năm</h4>
                    <div style={{ display: "flex" }}>
                        <div style={{ marginRight: "20px" }}>
                            <Space>
                                <DatePicker picker="year" onChange={handleYearChange} />
                            </Space>
                        </div>
                        <div style={{ height: "120px" }}>
                            {Object.entries(revenueDataYear).map(([period, revenue]) => (
                                <div key={period}>
                                    <p style={{ fontWeight: "500", marginBottom: "10px" }}>Doanh thu năm {period}: </p>
                                    <p>Tạm tính: {convertPrice(revenue)}</p>
                                    <p>Đã thu: {convertPrice(revenueDataYearIsPaid)}</p>
                                    <p>Chưa thu: {convertPrice(revenue - revenueDataYearIsPaid)}</p>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>

            </ModalComponent>

           


        </div>



    )

}

export default AdminUser