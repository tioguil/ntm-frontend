import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import axios from 'axios'
import $ from 'jquery';
import {URL} from '../../global'

export default class ListarProjetos extends Component {
    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.usuario = user
        this.token = user.token.numero
        this.state= {projetos:[]}
        if(usuario == null){
            this.usuario = null
        }else{
            this.usuario = user.perfilAcesso
        }
    }

    componentDidMount(){
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}projeto/gestor/listar/`,config)
            .then(resp=> this.setState({projetos:resp.data.response}))
    }

    projeto_detalhe(id){
        sessionStorage.setItem('idProjeto', id);
        this.props.history.push('/detalheProjeto')

    }
    render(){
        if(this.usuario == null || this.usuario === "analista"){
            return (
                <Redirect to ="/"/>
            );
        }
        return (


            <div>
                <br/>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboardAdmin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Listar Projetos</li>
                </ol>
                <h3>Listar Projetos</h3>
                <hr/>
                <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                    <thead>
                    <tr>
                        <th className="th-sm">Nº Projetos<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Projetos <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Status <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Região <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                    </tr>
                    </thead>

                    <tbody className="curso-pointer">
                    {

                        this.state.projetos.map(function(projeto){
                            return(
                                <tr  key={projeto.id}onClick={this.projeto_detalhe.bind(this,projeto.id)}>
                                    <td>{projeto.numeroProjeto}</td>
                                    <td>{projeto.nome}</td>
                                    <td>{projeto.status}</td>
                                    <td>São Paulo</td>

                                </tr>
                            );
                        }.bind(this))
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}
