import React from 'react'

export default props => {

	const comentarios = ()=>{
        const lista = props.comentarios || []
          return lista.map(comentario => ( 
              <div>
              </div>
        ))
      }
    return (
    		  <div className="">
                {comentarios()}
          </div>

      )
}