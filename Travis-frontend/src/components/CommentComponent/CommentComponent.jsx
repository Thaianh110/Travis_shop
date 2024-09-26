import React from 'react'

const CommentComponent = (props) => {
  const {dataHref, width, idProduct} = props
  
  const productHref = dataHref+idProduct
  
  return (
    
    <div style={{margin: '-10px -12px 0'}}>
     <div class="fb-comments" data-href={productHref} data-width={width} data-numposts="5"></div>
    </div>
  )
}

export default CommentComponent