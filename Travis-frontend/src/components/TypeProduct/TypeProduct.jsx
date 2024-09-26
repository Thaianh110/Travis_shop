import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WrapperType } from './styled'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  const handleNavigatetype = (type) => {
    if (type === "Tất cả")
      navigate(`/product/get-all`, { state: "" })
    else
      navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: type })
  }
  return (
    <WrapperType onClick={() => handleNavigatetype(name)}>{name}</WrapperType>
  )
}

export default TypeProduct