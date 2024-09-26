import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import official from "../../assets/images/official.png"
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'

const CardComponent = (props) => {
    const { image, name, price, rating, discount, selled, id, ratingScore, ratingCount } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    const isHidden = (discount === 0) ? true : false
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '150px' }}
            style={{ width: "220px" }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <img
                src={official}
                style={{
                    width: '68px',
                    height: '14px',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    borderTopLeftRadius: '3px'
                }}
            />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{ratingScore ? (ratingScore / ratingCount).toFixed(1) : 0} </span>
                    <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán  {selled || 0}</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px', display: "block", color: "black", textDecoration: "line-through", visibility: isHidden ? "hidden" : "visible", height: isHidden ? "0" : "100%" }}>{convertPrice(price)}</span>
                <span style={{ marginRight: '8px' }}>{convertPrice(price * (100 - discount) / 100)}</span>
                <div style={{ visibility: isHidden ? "hidden" : "visible", display: "contents" }}>
                    <WrapperDiscountText>
                        giảm {discount || 5} %
                    </WrapperDiscountText>
                </div>
            </WrapperPriceText>

        </WrapperCardStyle>
    )
}

export default CardComponent