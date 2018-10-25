import React from 'react'
import moment from 'moment/moment'
export default props => {
  var usuario = localStorage.getItem('user');
  const user = JSON.parse(usuario);
  const idLogado = user.id

  const formataData = (data) => {
    console.log(data)
    let dataFormatada = moment.utc(data).format('DD/MM/YYYY HH:mm:ss')
    return dataFormatada
  }

	const comentarios = ()=>{
        const lista = props.comentarios 
          return lista.map(comentario => ( 
              <div key={comentario.id} className={comentario.usuario.id===idLogado? 'comentario' : 'comentario comentarios-eles' }>
                <div className={comentario.usuario.id===idLogado? 'eu-comentario':'eles-comentario'}>
                <span >{comentario.usuario.id===idLogado? 'Eu': comentario.usuario.nome}</span>
                </div>
                <div key={comentario.id}className={comentario.usuario.id===idLogado? 'comentario-body' : 'comentario-body eles' }>
                  <p className="comentarios-p">{comentario.comentario}</p>
                </div>
                <span className="comentarios-data">{formataData(comentario.dataComentario)}</span>
              </div>

        ))
      }
    return (
    		<div className="detalhe-projeto">
                {comentarios()}
        </div>
  

      )
}