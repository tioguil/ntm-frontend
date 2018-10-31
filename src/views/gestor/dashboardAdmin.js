import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import {Pie} from 'react-chartjs-2';
import axios from "axios";
import {URL} from "../../global";


export default class DashboardAdmin extends Component {

    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.token = user.token.numero;
        if(usuario == null){
            this.state = {user:null}
        }
        else{
            this.state = {
                user:user.perfilAcesso,
                dias:30,
                totalAtividade:0,
                iniciada:10,
                pendente:0,
                pausada:0,
                cancelada:0,
                finalizada:0,
                chartAtividade: {
                    labels: [
                        'Iniciado',
                        'Pendente',
                        'Pausado',
                        'Cancelado',
                        'Finalizado'
                    ],
                    datasets: [{
                        data: [10, 0, 0, 0, 0],
                        backgroundColor: [
                            '#8fbc00',
                            '#e14440',
                            '#f77d00',
                            '#f9c200',
                            '#2c93b1'
                        ],
                        hoverBackgroundColor: [
                            '#8fbc00',
                            '#e14440',
                            '#f77d00',
                            '#f9c200',
                            '#2c93b1'
                        ]
                    }]

                }
            }
        }

        this.seteChartAtividade = this.seteChartAtividade.bind(this);

    }

    componentDidMount(){
        var config = {headers:{Authorization:this.token}};

        axios.get(`${URL}atividade/gestor/listar/dash/${this.state.dias}`,config)
            .then(resp=> this.seteChartAtividade(resp.data.response))
    }

    seteChartAtividade(response){

        for (let i = 0; i < response.length; i++){
            switch (response[i].status) {
                case 'iniciada':
                    this.setState({iniciada:response[i].qtd});
                    this.setState({totalAtividade: this.state.totalAtividade + response[i].qtd});
                    break;
                case 'pendente':
                    this.setState({pendente:response[i].qtd});
                    this.setState({totalAtividade: this.state.totalAtividade + response[i].qtd});
                    break;
                case 'pausada':
                    this.setState({pausada:response[i].qtd});
                    this.setState({totalAtividade: this.state.totalAtividade + response[i].qtd});
                    break;
                case 'cancelada':
                    this.setState({cancelada:response[i].qtd});
                    this.setState({totalAtividade: this.state.totalAtividade + response[i].qtd});
                    break;
                case "finalizada":
                    this.setState({finalizada:response[i].qtd});
                    this.setState({totalAtividade: this.state.totalAtividade + response[i].qtd});
                    break;
            }

        }

        this.setState({chartAtividade: {
                labels: [
                    'Iniciado',
                    'Pendente',
                    'Pausado',
                    'Cancelado',
                    'Finalizado'
                ],
                datasets: [{
                    data: [this.state.iniciada, this.state.pendente, this.state.pausada, this.state.cancelada, this.state.finalizada],
                    backgroundColor: [
                        '#8fbc00',
                        '#e14440',
                        '#f77d00',
                        '#f9c200',
                        '#2c93b1'
                    ],
                    hoverBackgroundColor: [
                        '#8fbc00',
                        '#e14440',
                        '#f77d00',
                        '#f9c200',
                        '#2c93b1'
                    ]
                }]

            }})

    }

    mostrarDetalhes(){
        this.props.history.push("/DetalheAtividade");
    }

    cadastrar_projeto(){
        this.props.history.push("/cadastrarProjeto");
    }

    cadastra_analista(){
        this.props.history.push("/cadastrarAnalista");
    }

    listar_projeto(){
        this.props.history.push("/listarProjetos");
    }

    listar_analistas(){
        this.props.history.push("/listarAnalistas");
    }

    render(){
        if(this.state.user == null || this.state.user === "analista"){
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
                    <li className="breadcrumb-item active">Visão geral</li>
                </ol>
                <h3>Visão geral</h3>
                <hr/>
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-xl-3 col-sm-6 mb-3">
                            <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.cadastrar_projeto.bind(this)}>
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fas fa-fw fa-file-signature"></i>
                                    </div>
                                    <div className="mr-5"></div>
                                </div>
                                <div className="card-footer text-white clearfix small z-1">
                                    <span className="float-left">Cadastrar Projetos</span>
                                    <span className="float-right">
                              <i className="fas fa-angle-right"></i>
                            </span>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-3 col-sm-6 mb-3">
                            <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.listar_projeto.bind(this)}>
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fas fa-fw fa-list-alt"></i>
                                    </div>
                                    <div className="mr-5"></div>
                                </div>
                                <div className="card-footer text-white clearfix small z-1">
                                    <span className="float-left">Listar Projetos</span>
                                    <span className="float-right">
                              <i className="fas fa-angle-right"></i>
                            </span>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-3 col-sm-6 mb-3">
                            <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.cadastra_analista.bind(this)}>
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fas fa-fw fa-user-plus"></i>
                                    </div>
                                    <div className="mr-5"></div>
                                </div>
                                <div className="card-footer text-white clearfix small z-1">
                                    <span className="float-left">Cadastrar Analistas</span>
                                    <span className="float-right">
                              <i className="fas fa-angle-right"></i>
                            </span>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-3 col-sm-6 mb-3">
                            <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.listar_analistas.bind(this)}>
                                <div className="card-body">
                                    <div className="card-body-icon">
                                        <i className="fas fa-fw fa-users"></i>
                                    </div>
                                    <div className="mr-5"></div>
                                </div>
                                <div className="card-footer text-white clearfix small z-1">
                                    <span className="float-left">Listar Analistas</span>
                                    <span className="float-right">
                                        <i className="fas fa-angle-right"></i>
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <br/>
                <div className= "row">
                    <div className = "col-md-6">
                        <h3>Atividade dos últimos 30 dias</h3>
                        Total de atividade: {this.state.totalAtividade}
                        <hr/>
                        <Pie
                            data={this.state.chartAtividade}
                        />
                    </div>
                </div>
                <hr/>
            </div>
        );
    }
}
