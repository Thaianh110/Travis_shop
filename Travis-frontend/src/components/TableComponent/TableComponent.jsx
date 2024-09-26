import { Table } from 'antd';
import React, { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { convertPrice, getBase64 } from '../../utils'
import { jsPDF } from "jspdf";
import * as htmlToImage from 'html-to-image'

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDelteMany, titleButton, noDelete, displayButtonPrint } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  const handleDeleteAll = () => {
    handleDelteMany(rowSelectedKeys)
  }
  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };
  const exportPDF = () => {
    // Tạo một đối tượng jsPDF mới
    const table = document.querySelector('.ant-table');
    const pdf = new jsPDF();
    pdf.addFont('/times new roman.ttf', 'ArialUnicodeMS', 'normal')
    pdf.setFont("ArialUnicodeMS");
    // Thiết lập độ rộng của từng cột
    htmlToImage.toPng(table)
      .then(function (dataUrl) {
        // Tạo một đối tượng jsPDF mới
        const pdf = new jsPDF();

        // Thêm hình ảnh vào tài liệu PDF
        pdf.addImage(dataUrl, 'PNG', 10, 10, 180, 0); // Thay đổi kích thước và vị trí nếu cần

        // Lưu tài liệu PDF vào một tệp
        pdf.save("table.pdf");
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  }
  const calculateWindowPosition = (windowWidth, windowHeight) => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const x = (screenWidth - windowWidth) / 2;
    const y = (screenHeight - windowHeight) / 2;

    return { x, y };
  };

  const formatTime = (time) => {
    return format(new Date(time), "HH:mm dd/MM/yyy")
  }


  const printInvoice = () => {
    const selectedData = dataSource.filter(item => rowSelectedKeys.includes(item.key));
    console.log("selectdata", selectedData)
    const windowWidth = 600;
    const windowHeight = 800;
    const windowPosition = calculateWindowPosition(windowWidth, windowHeight);
    const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${windowPosition.x},top=${windowPosition.y},scrollbars=yes,resizable=no`;
    const newWindow = window.open('', '_blank', windowFeatures);
    let htmlContent = `
      <html>
      <head>
        <title> Hóa đơn hớt tóc</title>
          <style>
                html{
                  background-color: #ccc;
                }
                body {
                  background-color: #fff;
                  font-family: Arial ,sans-serif;
                }
                div{
                  margin:10px 0;
                }
                .invoice-header {
                  text-align: center;
                    font-size: 20px;
                    margin-bottom: 20px;
                }
                .invoice-table {
                  width: 100%;
                  border-collapse: collapse;
                }
                .invoice-table th, .invoice-table td {
                  border: 1px solid #ccc;
                  padding : 8px;
                  font-size: 13px;
                }
                .wrapper-button{
                  display: flex;
                  justify-content:flex-end ;
                  align-items: center;
                }
                .print-button{
                  background-color: rgb(27,191,218);
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 5px;
                }
                #result td{
                  text-align: center;
                }
                .hidden-button{
                  display:none;
                }
                .cancel-print-button{
                  background-color: #ccc;
                  border: none;
                  color: #000;
                  padding: 15px ;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  font-size: 16px;
                  margin: 4px 2px;
                  cursor: pointer;
                  border-radius: 5px;
                }
                .print-content {
                  width: 400px;
                  margin: 0 auto; /* Căn giữa phần nội dung in */

                }
                @media print {
                    @page {
                      width: 5cm;
                      height: 5cm;
                      overflow-y:auto;
                    }
                  }
                  .page-break {
                    page-break-after: always; /* Ngắt trang sau mỗi thẻ <hr> */
                  }
                }
          </style>
      </head>
      <body>`
    selectedData.forEach(item => {
      htmlContent += `
         <div class="print-content">
<div style="font-weight:600" class='invoice-header'>Hóa Đơn Mua Hàng</div>
            <div>
              <div> Họ và tên:  ${item.userName}</div>
              <div> Số điện thoại:  ${item.phone}</div>
              <div> Địa chỉ:  ${item.address}</div>
              <div> Thời gian:  ${formatTime(item.timeOrder)}</div>
              <div> Hình thức thanh toán:  ${item.paymentMethod} </div>
              <div> Tình Trạng giao hàng: ${item.isDelivered === "TRUE" ? " Đơn hàng đã được giao" : "Đơn hàng chưa được giao"}</div>
              <div> Tình Trạng thanh toán: ${item.isPaid === "TRUE" ? "Đã thanh toán" : "Chưa thanh toán"}</div>
            </div>
            <table class='invoice-table'>
              <label>Danh sách sản phẩm </label>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Giảm giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
            <tbody>`
      item.orderItems.forEach((orderItem, index) => {
        htmlContent += `
              <tr id='result' key=${index}>
              <td width=20>${index + 1}</td>
              <td>${orderItem.name}</td>
              <td width=60>${orderItem.amount}</td>
              <td>${convertPrice(orderItem.price)}</td>
              <td> - ${convertPrice(orderItem.price * orderItem.discount / 100)} (${orderItem.discount}%)</td>
              <td>${convertPrice(orderItem.amount * orderItem.price * (100 - orderItem.discount) / 100)}</td>
          </tr>`
      })

      htmlContent += `
              </tbody>
            </table>
              <div style="display:flex;justify-content:space-between">Phí vận chuyển: <span>+ ${convertPrice(item.shippingPrice)}</span> </div>
              <hr>
              <div style="display:flex;justify-content:space-between">Tổng tiền: <span>${item.totalPrice}</span></div>
                
              <hr class="page-break" style="border-top: 2px dashed #ccc;">
              </div>
              `
    })
    htmlContent += `  
              <div class="wrapper-button">
                <button id="printButton" class="print-button">In hóa đơn</button>
                <button id="cancelPrintButton" class="cancel-print-button">Hủy hóa đơn</button>
              </div>
              </body>
            </html>`

    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();

    const printButton = newWindow.document.getElementById('printButton');
    const cancelPrintButton = newWindow.document.getElementById('cancelPrintButton');
    const wrapperButton = newWindow.document.querySelector('.wrapper-button');

    printButton.addEventListener('click', () => {
      wrapperButton.classList.add('hidden-button');
      if (newWindow.print()) {
        wrapperButton.classList.remove('hidden-button');
        newWindow.close();
      } else {
        wrapperButton.classList.remove('hidden-button');
      }
    });
    cancelPrintButton.addEventListener('click', () => {
      wrapperButton.classList.remove('hidden-button');
      newWindow.close();
    });
  };


  return (
    <>
      {!!rowSelectedKeys.length && noDelete !== false && (
        <div style={{
          background: '#1d1ddd',
          color: '#fff',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <button style={{ padding: "5px", fontWeight: 'bold', margin: "10px 10px 10px 0px " }} onClick={titleButton !== "Export PDF" ? exportExcel : exportPDF}>{titleButton}</button>
      {displayButtonPrint === true && (
        <button style={{
          padding: "5px",
          fontWeight: 'bold',
          margin: "10px 10px 2px 0 "
        }}
          onClick={printInvoice}>In hóa đơn</button>
      )}

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </>
  )
}

export default TableComponent