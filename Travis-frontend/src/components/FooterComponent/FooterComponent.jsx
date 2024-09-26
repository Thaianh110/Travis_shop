import 'bootstrap/dist/css/bootstrap.min.css';
import './footer.css'
import React from 'react'



export default function Footer() {
  return (
    <footer>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <section className="mes">
        <div className="mes-item2">
          <p style={{ color: "black" }}>Chat với chúng tôi</p>
        </div>
        <div className="mes-item1">
          <a target='_blank' href="https://www.facebook.com/messages/t/257549394110918">
            <i
              className="fa-brands fa-facebook-messenger fa-beat fa-2xl"
              style={{ color: "#117bcb" }}
            />
          </a>
        </div>
      </section>
      <div className="container">
        <div className="row">
          <div className="col-4">
            <a href="">
              {" "}
              <p>Thông tin về TRAVIS BARBER SHOP</p>
            </a>
            <a href="">
              {" "}
              <p>Chính sách bảo mật</p>
            </a>
            <p>Giờ phục vụ: 8h30 - 20h30 (Thứ 2-Chủ nhật)</p>
          </div>
          <div className="col-4 contact-fd">
            <p>Theo dõi chúng tôi trên:</p>
            <a href="https://www.facebook.com/profile.php?id=61557523358069">
              <i className="fa-brands fa-facebook" style={{ color: "rgb(20, 13, 162)" }} />
            </a>
            <a href="">
              <i className="fa-brands fa-instagram" style={{ color: "rgb(203, 18, 129)" }} />
            </a>
            <a href="">
              <i className="fa-brands fa-tiktok" style={{ color: "rgb(17, 13, 13)" }} />
            </a>
          </div>
          <div className="col-4 ft-logo " >
            <img src="../logo.png" alt="" width="60%" />
          </div>
        </div>
      </div>
    </footer>


  )
}
