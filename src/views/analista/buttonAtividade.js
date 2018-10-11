import React from 'react'

export default props => {
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    const idLogado = user.id

    const botao = (<i  onClick={props.button} className={props.status=='iniciada'? 'far fa-play-circle fa-8x play':'far fa-stop-circle fa-8x stop'}></i>) 
  
  return (
    	<div className="contador mt-2">
            {botao}
            {/*<i className="far fa-stop-circle fa-8x stop"></i>*/}                
      </div>
  

      )
}