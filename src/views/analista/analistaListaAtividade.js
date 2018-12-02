import React from 'react'

export default props => {
    const date = (atividade) => {
        var date = new Date(0,atividade.substring(5,7),0),
            locale = "pt-BR",
            month = date.toLocaleString(locale, { month: "short" });

        return month.toUpperCase();
    }

    const atividades = () => {
        const lista = props.atividades || [];
        if (lista.length>0) {
            return lista.map(atividade =>
                (
                    <div key={atividade.id} className="container curso-pointer"
                         onClick={() => props.mostrarDetalhes(atividade.id)}>
                        <div className="row row-striped lista-atividade py-2">
                            <div className="col-2 text-right">
                                <p className="display-4">
                                    <span
                                        className="badge badge-secondary">{(atividade.dataEntrega).substring(8, 10)}</span>
                                </p>
                                <h5>{date(atividade.dataEntrega)}</h5>
                            </div>
                            <div className="col-sm-12 col-md-7">
                                <h4 className="text-uppercase">
                                    <strong>{atividade.nome} <p
                                        className="inline status-atividade-analista">({atividade.status})</p></strong>
                                </h4>
                                <ul className="list-inline">
                                    <li className="list-inline-item link-style">
                                        <i className="fa fa-location-arrow" aria-hidden="true"></i> <a
                                        onClick={() => props.mapsSelector(atividade.endereco, atividade.enderecoNumero)}
                                        className="atividade-localizacao"> {atividade.endereco}, {atividade.enderecoNumero} - {atividade.cidade} - {atividade.uf}</a>
                                    </li>
                                </ul>
                                <p>{atividade.descricao}</p>
                            </div>
                        </div>
                        <hr/>
                    </div>
                )
            );
        }else{
            return (<div className="n-existem"> Não existem atividades</div>)
        }
    }

    return (
        <div>
            { atividades() }
        </div>
    );
}