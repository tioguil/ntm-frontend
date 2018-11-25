import React from 'react'

export default props => {
    const trabalho = ()=>{
        const lista = props.horarioTrabalho
        return lista.map(trabalho => (
            <tr key={trabalho.id}>
                <td>{trabalho.dataInicio}</td>
                <td>{trabalho.dataFim === null ? "Em andamento": trabalho.dataFim}</td>
                <td>{trabalho.totalHoras}</td>
            </tr>

        ))
    }
    return (
        <div>
            <table className="table table-striped" style={{"fontSize":"10px", "marginTop":"10px"}}>
                <thead>
                <tr>
                    <th scope="col">Inicio</th>
                    <th scope="col">Fim</th>
                    <th scope="col">Horas</th>
                </tr>
                </thead>
                <tbody>
                {trabalho()}
                <tr>
                    <td colSpan="2">Total</td>
                    <td>{props.totalTrabalho} horas</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}