import { Image, Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: rgb(27,191,218);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 90%;
    padding: 10px 0;
`

export const WrapperTextHeader = styled(Link)`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    &:hover {
        font-size: 18px;
        color: #fff;
    }
`

export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    margin-right: 80px;
    color: #fff;
    gap: 10px;
    max-width: 400px;
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    cursor: pointer
`

export const WrapperContentPopup = styled.p`

    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`
export const WrapperHeaderTextSmall = styled.span`
    font-size:12px;
    color: #fff;
    white-space:nowrap;
`
export const WrapperHeaderLogo = styled.span`
    font-size : 18px;
    font-weight: bold;
    color : #fff;
    cursor: pointer;
`
export const WrapperLogoHomePage= styled(Image)`
    &.ant-col-4 {
        display: flex;
        justify-content: center;
    } 
`