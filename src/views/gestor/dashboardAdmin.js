import React, { Component } from 'react';
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'
import {Redirect,Link} from 'react-router-dom';



export default class DashboardAdmin extends Component {
  
  constructor(props){
    super(props);
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    if(usuario == null){
      this.state = {user:null}
    }

    else{
      this.state = {user:user.perfilAcesso}
    }
  }


  mostrarDetalhes(){
    this.props.history.push("/DetalheAtividade");
  }

  mapsSelector() {
    if ((navigator.platform.indexOf("iPhone") !== -1) ||
        (navigator.platform.indexOf("iPod") !== -1) ||
        (navigator.platform.indexOf("iPad") !== -1)){
      window.open("maps://maps.google.com/maps?daddr=universidade+sao+judas+tadeu");
    } else {
      window.open("https://maps.google.com/maps?daddr=universidade+sao+judas+tadeu");
    }
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
        <NavbarTemplate/>
            <div className="row">
              <div className="col-2.5">
                <SidebarTemplate/>
              </div>
                <div className="col Container">
                <br/>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/dashboardAdmin">Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">Visão geral</li>
                    </ol>
                    <h3>Visão geral</h3>
                    <hr/>
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
                    <hr/>
              <FooterTemplate/>
              </div>
            </div>
        </div>
    );
  }
}
