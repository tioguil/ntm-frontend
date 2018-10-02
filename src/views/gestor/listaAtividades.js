import React from 'react'

export default props => {

	const atividades = ()=>{
        const lista = props.atividades
          return lista.map(atividade => ( 
              <div key={atividade.id}className="card margin-bottom-card-atividades">
                  <div className="card-header">
                      <strong> {atividade.nome} - </strong> <em> {atividade.status}</em><a className="fas fa-lg fa-edit float-right editar-atividade" onClick={() => props.showModal(atividade)}></a>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                        {atividade.descricao}
                    </p>
                      <button className="btn btn-primary float-right" onClick={() => props.atividade(atividade.id)}>Visualizar</button>
                  </div>
                  <div className="card-footer text-muted">
                        {atividade.dataCriacao} - {atividade.dataEntrega}
                  </div>
            </div>
        ))
      }
    return (
    		<div className="detalhe-projeto table-wrapper-scroll-y">
                {atividades()}
            </div>

      )
}