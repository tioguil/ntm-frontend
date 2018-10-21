import React from 'react'

export default props => {
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    let botao;

    if(props.status !== 'finalizada'){
    botao = (<i onClick={() =>props.button(null)} 
                className='far fa-play-circle fa-2x play'>
          </i>)

    
      for (let i=0 ;i<props.list.length; i++){
        if(props.list[i].dataFim == null){
            botao = (<i onClick={() => props.button(props.list[i].id)} 
                  className='far fa-pause-circle fa-2x pause'>
            </i>)
          }
      }
    }
  
  return (
    	<div className="contador mt-2">
            {botao}    
      </div>
  

      )
}