import React from 'react'

export default props => {
	const atividades = ()=>{
        const lista = props.atividades 
          return lista.map(atividade => ( 
                <div key={atividade.id} className="container" onClick={()=> props.mostrarDetalhes(atividade.id)}>
                        <div className="row row-striped">
                          <div className="col-2 text-right">
                            <p className="display-4"><span className="badge badge-secondary">23</span></p>
                            <h5>OCT</h5>
                          </div>
                          <div className="col-10">
                            <h4 className="text-uppercase"><strong>{atividade.nome}<p className="inline">({atividade.status})</p></strong></h4>
                              <ul className="list-inline">
                              <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i>{atividade.dataEntrega}</li>
                              <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i> <a onClick={()=>props.mapsSelector(atividade.endereco,atividade.enderecoNumero)}className="atividade-localizacao"> {atividade.endereco}, {atividade.enderecoNumero}-{atividade.cidade} - {atividade.uf}</a></li>
                            </ul>
                            <p>{atividade.descricao}</p>
                          </div>
                        </div>
                      <hr/>
                  </div>

        ))
      }
    return (
    		<div className="detalhe-projeto table-wrapper-scroll-y">
                {atividades()}
        </div>

      )
}