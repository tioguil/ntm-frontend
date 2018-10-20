import React from 'react';

export default props => {

  // const formataData = (data) => {
  //   let dataFormatada = data.split("-");
  //   return dataFormatada[2]+"/"+dataFormatada[1]+"/"+dataFormatada[0];
  // }

	const atividades = () => {
    const lista = props.atividades || [];
    return lista.map(atividade => (
        <div key={atividade.id} className="card text-center card-detalhe-analista">
            <div className="card-body">
              <h5 className="card-title">{atividade.nome}</h5>
              <p className="card-text">{atividade.descricao}</p>
              <button className="btn btn-primary" onClick={props.atividade(atividade.id)}>Visualizar</button>
            </div>
        </div>

      )
    );
  }

  return (
    <div>
      {atividades()}
    </div>
  );
}