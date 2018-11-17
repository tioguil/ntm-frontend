import React, { Component } from 'react';
import {Redirect,Link } from 'react-router-dom';
import AnalistaListarAtividade from './analistaListaAtividade'
import axios from 'axios'
import {Input} from 'reactstrap';
import {URL} from '../../global'

export default class Dashboard extends Component {
    constructor(){
        super();
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);

        this.usuario = user;
        this.state = { atividades: [],data_criacao:'',data_entrega:'',status:'todos'}
        this.token = user.token.numero;
        this.refresh = this.refresh.bind(this);
        this.mostrarDetalhes = this.mostrarDetalhes.bind(this);
        if (usuario == null) {
            this.usuario = null;
        } else {
            this.usuario = user.perfilAcesso;
        }
        this.refresh();
    }

    refresh(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        axios.get(`${URL}atividade/analista/lista`, config)
            .then(resp => this.setState(...this.state, {
                    atividades: resp.data.response.atividades
                }
                )
            );
    }

    mostrarDetalhes(idAtividade){
        sessionStorage.setItem('idAtividadeAnalista', idAtividade);
        this.props.history.push(`/DetalheAtividade`);
    }

    mapsSelector(endereco,numero) {
        if ((navigator.platform.indexOf("iPhone") !== -1) ||
            (navigator.platform.indexOf("iPod") !== -1) ||
            (navigator.platform.indexOf("iPad") !== -1)) {
            window.open("maps://maps.google.com/maps?daddr=" +endereco + numero);
        } else {/* else use Google */
            window.open("https://maps.google.com/maps?daddr="+ endereco + numero);
        }
    }

    formataDataEntrega(evento) {
       this.setState({data_entrega:evento.target.value})
    }

    formataDataCriacao(evento) {
        this.setState({data_criacao:evento.target.value})
    }

    choiceStatus(evento){
        this.setState({status:evento.target.value})
    }


    filtroAtividade(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        if(this.state.data_criacao === '' && this.state.data_entrega === ''){
            axios.get(`${URL}atividade/analista/search/${this.state.status}`, config)
                .then(resp => this.setState(...this.state, {
                        atividades: resp.data.response
                    }
                    )
                );
        }else {
            axios.get(`${URL}atividade/analista/search/${this.state.status}/${this.state.data_criacao}/${this.state.data_entrega}`, config)
                .then(resp => this.setState(...this.state, {
                        atividades: resp.data.response
                    }
                    )
                );
        }


    }

    render(){
        if(this.usuario == null || this.usuario === "gestor"){
            return (
                <Redirect to ="/"/>
            );
        }

        return (
            <div>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Visão geral</li>
                </ol>

                <h3>Visão geral</h3>
                <hr/>
                <div className="container">
                <div className="row">
                    <select id="status" value={this.state.status} onChange={this.choiceStatus.bind(this)} className="col-md-2 form-control statusAnalista marginButton">
                        <option selected>{this.state.status}</option>
                        <option>todos</option>
                        <option>finalizada</option>
                        <option>iniciada</option>
                        <option>pendente</option>
                        <option>cancelada</option>
                    </select>

                    <Input type="date" className="col-md-2 statusAnalista marginButton" onChange={this.formataDataCriacao.bind(this)}
                    value={this.state.data_criacao} />

                    <Input type="date" className="col-md-2 statusAnalista marginButton" onChange={this.formataDataEntrega.bind(this)}
                    value={this.state.data_entrega} />

                    <button type="button" onClick={this.filtroAtividade.bind(this)} className="btn btn-primary btn-round filterAtividade marginButton col-sm-2">Filtrar</button>
                </div>
            </div>
                <hr/>
                <AnalistaListarAtividade
                    atividades={this.state.atividades}
                    mostrarDetalhes={this.mostrarDetalhes}
                    mapsSelector={this.mapsSelector} />
            </div>
        );
    }
}