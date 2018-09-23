import 'bootstrap/dist/css/bootstrap.min.css'
import React, { Component } from 'react';


export default class Sidebar extends Component {
    constructor(){
      super();
      var usuario = localStorage.getItem('user');
      const user = JSON.parse(usuario);
      this.state = {tipo:user.perfilAcesso}
    }  
    
  render(){
    let cadastrarProjetos;
    let listarProjetos;
    let cadastrarAnalistas;
    let listarAnalistas;
    let listarDemanda;
    let display = 'none';
    let dashboard = "/Dashboard";
    let cadastrarDemanda;
    let calendario;

    

    if(this.state.tipo == "gestor" ){
      dashboard = "/DashboardAdmin";
      display = 'block';

      listarProjetos= `
        <a class="nav-link" href="/listarProjetos">
           <i class="fas fa-list"></i>
          <span>Listar Projetos</span>
        </a>`;

      cadastrarProjetos= `
        <a class="nav-link" href="/cadastrarProjetos">
           <i class="fas fa-file-signature"></i>
          <span>Cadastrar Projetos</span>
        </a>`;
      cadastrarAnalistas= `
        <a class="nav-link" href="#">
           <i class="fas fa-user-plus"></i>
          <span>Cadastrar Analistas</span>
        </a>`;

      cadastrarDemanda= `
        <a class="nav-link" href="#">
           <i class="fas fa-chart-line"></i>
          <span>Cadastrar Demanda</span>
        </a>`;
      listarDemanda= `
        <a class="nav-link" href="#">
           <i class="fas fa-list-ol"></i>
          <span>Listar Demandas</span>
        </a>`;

        listarAnalistas= `
        <a class="nav-link" href="/listarAnalistas">
           <i class="fas fa-users"></i>
          <span>Listar Analistas</span>
        </a>`;


    }
    if (this.state.tipo == "analista"){
       calendario= `
        <a class="nav-link" href="#">
           <i class="fas fa-fw fa-calendar-alt"></i>
          <span>Calendário</span>
        </a>`;
    }

    return (
      <div className="sidebar navbar-nav">
        <div className="container">
          <li className="nav-item active">
            <a className="nav-link" href={dashboard}>
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span className="ml-1">Dashboard</span>
            </a>
          </li>
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: calendario}} style={{display: {display}}}/>
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: cadastrarProjetos}} style={{display: {display}}}/>
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: listarProjetos}} style={{display: {display}}}/>
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: cadastrarDemanda}} style={{display: {display}}}/>
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: listarDemanda}} style={{display: {display}}}/>         
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: cadastrarAnalistas}} style={{display: {display}}}/>
          <li className="nav-item active" dangerouslySetInnerHTML={{__html: listarAnalistas}} style={{display: {display}}}/>
          
        </div>
      </div>
    );
  }
}
