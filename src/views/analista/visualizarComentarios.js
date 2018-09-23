import React, { Component } from 'react';
import {Redirect } from 'react-router-dom';
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'

export default class VisualizarComentarios extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    if(usuario == null){
      this.usuario = null
    }
    else{
      this.usuario = user.perfilAcesso
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
        <NavbarTemplate/>
          <div className="row">
            <div className="col-2.5">
              <SidebarTemplate/>
            </div>
              <div className="col Container">
              <br/>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/detalheAtividade">Atividade</a>
                  </li>
                  <li className="breadcrumb-item active">Comentários</li>
                </ol>

                  <div className="text-center">
                    
                    <div className="container">
                      <div className="container light">
                        <p>Hello. How are you today?</p>
                        <span className="time-right">11:00</span>
                      </div>
                      <div className="container darker">
                        <p>Hey! Im fine. Thanks for asking!</p>
                        <span className="time-left">11:01</span>
                      </div>
                      <div className="container light">
                        <p>Hello. How are you today?</p>
                        <span className="time-right">11:00</span>
                      </div>
                      <div className="container darker">
                        <p>Hey! Im fine. Thanks for asking!</p>
                        <span className="time-left">11:01</span>
                      </div>
                      <div className="container light">
                        <p>Hello. How are you today?</p>
                        <span className="time-right">11:00</span>
                      </div>
                      <div className="container darker">
                        <p>Hey! Im fine. Thanks for asking!</p>
                        <span className="time-left">11:01</span>
                      </div>
                    </div>
                </div>
                <FooterTemplate/>
              </div>

          </div>
      </div>
    );
  }
}
