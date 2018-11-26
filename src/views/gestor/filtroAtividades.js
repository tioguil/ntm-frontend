import React from 'react';

export default props => {

  const formataData = (data) => {
    let dataFormatada = data.split("-");
    return dataFormatada[2]+"/"+dataFormatada[1]+"/"+dataFormatada[0];
  }

	const atividade = () => {
    const lista = props.atividades || [];
    console.log(lista.length)
    if (lista.length === 0){
      return (<div className="n-existem">Não existem atividades nesse período!</div>)
    }
    return lista.map(atividade => (
        <div key={atividade.id} className="card text-center card-detalhe-analista">
            <div className="card-body">
              <h5 className="card-title">{atividade.nome} <i> ({atividade.status}) </i></h5>
              <p className="card-text">{atividade.descricao.substring(0,100)}...</p>
              <p className="card-text">Data Entrega:{formataData(atividade.dataEntrega)}</p>
              <button className="btn btn-primary btn-round" onClick={()=>props.visualizarAtividade(atividade.id)}>Visualizar</button>
            </div>
      </div>
      )
    );
  }

  return (
    <div>
      {atividade()}
    </div>
  );
}