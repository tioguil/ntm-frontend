import 'bootstrap/dist/css/bootstrap.min.css'
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class Sidebar extends Component {
    constructor(props){
      super(props);
      var usuario = localStorage.getItem('user');
      const user = JSON.parse(usuario);
     
      this.state = {tipo:user.perfilAcesso}
    }  
    
    cadastrarProjeto(){
      this.props.history.push("/cadastrarProjeto")
    }
  render(){
    
    let cadastrarProjetos;
    let listarProjetos;
    let cadastrarAnalistas;
    let listarAnalistas;
    let display = 'none';
    let dashboard = "/Dashboard";
    let calendario;
    if(this.state.tipo === "gestor" ){
      dashboard = "/DashboardAdmin";
      display = 'block';

      listarProjetos= `
        <a class="nav-link">
           <i class="fas fa-list"></i>
          <span>Listar Projetos</span>
        </a>`;

      cadastrarProjetos= `
        <a class="nav-link">
           <i class="fas fa-file-signature"></i>
          <span>Cadastrar Projetos</span>
        </a>`;
      cadastrarAnalistas= `
        <a class="nav-link" >
           <i class="fas fa-user-plus"></i>
          <span>Cadastrar Analistas</span>
        </a>`;
        listarAnalistas= `
        <a class="nav-link">
           <i class="fas fa-users"></i>
          <span>Listar Analistas</span>
        </a>`;


    }
    if (this.state.tipo === "analista"){
       calendario= `
        <a class="nav-link" >
           <i class="fas fa-fw fa-calendar-alt"></i>
          <span>Calendário</span>
        </a>`;
    }

    return (
      <ul className="sidebar navbar-nav">
        <div className="sidebar">
          <li className="nav-item active">
            <Link className="nav-link" to={dashboard}>
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span className="ml-1">Dashboard</span>
            </Link>
          </li>
          <Link to="/calendario" className="nav-item active nounderline" dangerouslySetInnerHTML={{__html: calendario}} style={{display: {display}}}/>
          <Link to="/cadastrarProjeto"className="nav-item active nounderline" dangerouslySetInnerHTML={{__html: cadastrarProjetos}} style={{display: {display}}}/>
          <Link to="/listarProjetos" className="nav-item active nounderline" dangerouslySetInnerHTML={{__html: listarProjetos}} style={{display: {display}}}/>      
          <Link to="/cadastrarAnalista" className="nav-item active nounderline" dangerouslySetInnerHTML={{__html: cadastrarAnalistas}} style={{display: {display}}}/>
          <Link to="/listarAnalistas" className="nav-item active nounderline" dangerouslySetInnerHTML={{__html: listarAnalistas}} style={{display: {display}}}/>
        </div>
      </ul>
    );
  }
}
