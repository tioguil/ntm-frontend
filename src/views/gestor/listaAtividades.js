import React from 'react';

export default props => {

  const formataData = (data) => {
    let dataFormatada = data.split("-");
    return dataFormatada[2]+"/"+dataFormatada[1]+"/"+dataFormatada[0];
  }

	const atividades = () => {
    const lista = props.atividades;
    
    return lista.map(atividade => (
        <div key={atividade.id} className="card margin-bottom-card-atividades">
          <div className="card-header">
            <strong> {atividade.nome} - </strong> <em> {atividade.status}</em><a className="fas fa-lg fa-edit float-right editar-atividade" onClick={() => props.showModal(atividade)}></a>
          </div>
          <div className="card-body">
            <p className="card-text">
              {atividade.descricao}
            </p>
            <button className="btn btn-primary float-right btn-round" onClick={() => props.atividade(atividade.id)}>Visualizar</button>
          </div>
          <div className="card-footer text-muted">
            Criado em: {formataData(atividade.dataCriacao)} - Data de entrega: {formataData(atividade.dataEntrega)}
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