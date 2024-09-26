import styled from "styled-components";


export const WrapperContainerLeft = styled.div`
    flex: 1;
    padding: 40px 45px 24px;
    display: flex;
    flex-direction: column;
`

export const WrapperContainerRight = styled.div`
    width: 300px;
    background: linear-gradient(136deg, rgb(27,191,218) -1%, rgb(219, 238, 255) 85%);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 6px;
    gap: 10px;
    
`
export const WrapperTextLight = styled.span`
    color: rgb(13, 92, 182);
    font-size: 13px;
    cursor: pointer;
`

export const WrapperHeaderText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color :rgb();
    font-size:26px; 
`
export const WrapperClosed = styled.div`
    font-size: 30px;
    cursor:pointer;
    margin: -20rem -7rem 8rem 20rem;
    &:hover{
        color: red;
    }
`
export const WrapperLabel = styled.label`
    color: #000;
    font-size: 16px;
    line-height: 30px;
    font-weight: 400;
    width: 200px;
    margin-left : 10px;
    text-align: left;
`

export const WrapperInput = styled.div`
    align-items: center;

    gap: 20px;
`
