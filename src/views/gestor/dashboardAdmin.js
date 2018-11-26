import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import {Pie, Bar} from 'react-chartjs-2';
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
                diasAtividade:30,
                diasProjeto: 30,
                totalAtividade:0,
                totalProjeto:0,
                iniciada:0,
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
                        data: [0, 0, 0, 0, 0],
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

                },
                chartProjeto:{
                    labels: ['iniciado', 'em andamento', 'finalizado', 'cancelado'],
                    datasets: [
                        {
                            label: 'Quantidade',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                            hoverBorderColor: 'rgba(255,99,132,1)',
                            data: [65, 59, 80, 81]
                        }
                    ]
                }
            }
        }

        this.seteChartAtividade = this.seteChartAtividade.bind(this);
        this.chartAtividadeDias = this.chartAtividadeDias.bind(this);
        this.atualizaGraficoAtividade =this.atualizaGraficoAtividade.bind(this);
        this.atualzaGraficoProjeto = this.atualzaGraficoProjeto.bind(this);
        this.seteChartProjeto = this.seteChartProjeto.bind(this);
        this.changeDiasProjeto = this.changeDiasProjeto.bind(this);

    }

    chartAtividadeDias(event){
        this.setState({diasAtividade:event.target.value})
        if(event.target.value >= 1 && event.target.value <= 120){
            this.atualizaGraficoAtividade(event.target.value)

        }
    }

    componentDidMount() {
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}atividade/gestor/listar/dash/${this.state.diasAtividade}`,config)
            .then(resp=> this.seteChartAtividade(resp.data.response))
            .then(resp =>{
                axios.get(`${URL}projeto/gestor/listarProject/dash/${this.state.diasProjeto}`,config)
                    .then(respProjeto=> this.seteChartProjeto(respProjeto.data.response))
            })

    }


    changeDiasProjeto(ev){
        this.setState({diasProjeto: ev.target.value});
        if(ev.target.value >= 1 && ev.target.value <= 120){
            this.atualzaGraficoProjeto(ev.target.value);
        }

    }

    atualzaGraficoProjeto(dias){
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}projeto/gestor/listarProject/dash/${dias}`,config)
            .then(resp=> this.seteChartProjeto(resp.data.response))
    }


    atualizaGraficoAtividade(dias){
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}atividade/gestor/listar/dash/${dias}`,config)
            .then(resp=> this.seteChartAtividade(resp.data.response))
    }

    seteChartProjeto(responseProjeto){
        this.setState({
            iniciadoP:0,
            emAndamentoP:0,
            finalizadoP:0,
            canceladoP:0,
            totalProjeto:0
        })
        for (let i = 0; i < responseProjeto.length; i++){

            switch (responseProjeto[i].status) {

                case 'iniciado':
                    this.setState({iniciadoP:responseProjeto[i].quantidade});
                    this.setState({totalProjeto: this.state.totalProjeto + responseProjeto[i].quantidade});
                    break;
                case 'em andamento':
                    this.setState({emAndamentoP:responseProjeto[i].quantidade});
                    this.setState({totalProjeto: this.state.totalProjeto + responseProjeto[i].quantidade});
                    break;
                case 'finalizado':
                    this.setState({finalizadoP:responseProjeto[i].quantidade});
                    this.setState({totalProjeto: this.state.totalProjeto + responseProjeto[i].quantidade});
                    break;
                case 'cancelado':
                    this.setState({canceladoP:responseProjeto[i].quantidade});
                    this.setState({totalProjeto: this.state.totalProjeto + responseProjeto[i].quantidade});
                    break;
            }

        }

        this.setState({chartProjeto: {
                labels: ['iniciado', 'em andamento', 'finalizado', 'cancelado'],
                datasets: [
                    {
                        label: 'Quantidade',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [this.state.iniciadoP, this.state.emAndamentoP, this.state.finalizadoP, this.state.canceladoP]
                    }
                ]
            }})

    }


    seteChartAtividade(response){
        this.setState({
            iniciada:0,
            pendente:0,
            pausada:0,
            cancelada:0,
            finalizada:0,
            totalAtividade: 0
        })
   
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
                        '#f9c200',
                        '#f77d00',
                        '#e14440',
                        '#2c93b1'
                    ],
                    hoverBackgroundColor: [
                        '#8fbc00',
                        '#f9c200',
                        '#f77d00',
                        '#e14440',
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

        const data = {
            labels: ['iniciado', 'em andamento', 'finalizado', 'cancelado'],
            datasets: [
                {
                    label: 'Quantidade',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [65, 59, 80, 81]
                }
            ]
        };

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

                    <div className = "col-md-6 col-sm-12 p-2">
                        <h3>Projeto dos últimos

                            <input className="numberDashboard" onChange={this.changeDiasProjeto} value={this.state.diasProjeto} type="number"  min="30" max="120"/>

                            dias
                        </h3>
                        Total de projeto: {this.state.totalProjeto}
                        <hr/>

                        <Bar
                            data={this.state.chartProjeto}
                        />
                    </div>

                    <div className = "col-md-6 col-sm-12 p-2">
                        <h3>Atividade dos últimos

                            <input className="numberDashboard" onChange={this.chartAtividadeDias} value={this.state.diasAtividade} type="number"  min="30" max="120"/>

                            dias
                        </h3>

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
