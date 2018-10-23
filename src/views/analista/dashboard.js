import React, { Component } from 'react';
import {Redirect,Link } from 'react-router-dom';
import AnalistaListarAtividade from './analistaListaAtividade'
import axios from 'axios'
import {URL} from '../../global'

export default class Dashboard extends Component {
    constructor(){
        super();
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);

        this.usuario = user;
        this.state = { atividades: [] }
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

                <AnalistaListarAtividade
                    atividades={this.state.atividades}
                    mostrarDetalhes={this.mostrarDetalhes}
                    mapsSelector={this.mapsSelector} />
            </div>
        );
    }
}