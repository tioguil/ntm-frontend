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
        this.state = { atividades: [],data_criacao:'',data_entrega:''}
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


    filtroAtividade(){
    // let inicio;
    // let fim;
    // let json;
    // var config = {headers:{Authorization:this.token}};
    // if(this.state.data != undefined){
    //   if (this.state.data.length > 1) {
    //     for(let i = 0; i<this.state.data.length ;i++){ 
    //       inicio=this.state.data[0].toISOString().split('T')[0]
    //       fim=this.state.data[1].toISOString().split('T')[0]

    //       axios.get(`${URL}atividade/gestor/listar/${inicio}/${fim}/${this.state.usuario.id}/`,config)
    //         .then(resp=> this.setState({atividades:resp.data.response}))
    //     }
    //   }
    //   else{
    //     inicio = this.state.data.toISOString().split('T')[0]
    //     fim = this.state.data.toISOString().split('T')[0]
    //     axios.get(`${URL}gestor/listar/${inicio}/${fim}/${this.state.usuario.id}/`,config)
    //       .then(resp=>this.setState({atividades:resp.data.response}))
    //   }
    // }
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
                <div className="row dashboardAnalista">
                    <select id="status" value="" onChange=""className="col-md-2 form-control statusAnalista">
                        <option selected>todos</option>
                        <option>finalizada</option>
                        <option>iniciada</option>
                        <option>pendente</option>
                        <option>cancelada</option>
                    </select>
       
                    <Input type="date" className="col-md-2 statusAnalista" onChange={this.formataDataCriacao.bind(this)} 
                    value={this.state.data_entrega} />

                    <Input type="date" className="col-md-2 statusAnalista" onChange={this.formataDataEntrega.bind(this)} 
                    value={this.state.data_entrega} />

                    <button type="button" onClick={this.filtroAtividade.bind(this)} className="btn btn-primary btn-round filterAtividade">Filtrar</button>
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