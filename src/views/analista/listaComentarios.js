import React from 'react'

export default props => {
  var usuario = localStorage.getItem('user');
  const user = JSON.parse(usuario);
  const idLogado = user.id;

  const comentarios = () => {
    const lista = props.comentarios || [];

    return lista.map(comentario => 
      (
        <div className={comentario.usuario.id===idLogado? 'comentario' : 'comentario comentarios-eles' }>
          <div className={comentario.usuario.id===idLogado? 'eu-comentario': 'eles-comentario'}>
            <span >{comentario.usuario.id===idLogado? 'Eu': comentario.usuario.nome}</span>
          </div>
          <div className={comentario.usuario.id===idLogado? 'comentario-body' : 'comentario-body eles' }>
            <p>{comentario.comentario}</p>
            <span className="time-right">{comentario.dataComentario}</span>
          </div>
        </div>
      )
    );
  }

  return (
    <div className="detalhe-projeto">
      { comentarios() }
    </div>
  );
}