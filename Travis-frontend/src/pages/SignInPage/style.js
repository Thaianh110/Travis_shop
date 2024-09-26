import styled from "styled-components";
export const WrapperContainerLeft = styled.div`
    flex: 1;
    padding: 40px 45px 24px;
    display: flex;
    flex-direction: column;
`

export const WrapperContainerRight = styled.div`
    width: 300px;
    background: linear-gradient(136deg, rgb(27, 191, 218) -1%, rgb(219, 238, 255) 85%);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`
export const WrapperTextLight = styled.span`
    color: rgb(13, 92, 182);
    font-size: 13px;
    cursor: pointer;
`
export const WrapperClosed = styled.div`
    font-size: 30px;
    cursor:pointer;
    margin: -14rem -7rem 2rem 20rem;
    &:hover{
        color: red;
    }
`