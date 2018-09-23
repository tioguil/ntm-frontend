import React, { Component } from 'react';
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'
import {Redirect } from 'react-router-dom';


export default class Dashboard extends Component {
    constructor(){
      super();
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
    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf("iPhone") !== -1) ||
      (navigator.platform.indexOf("iPod") !== -1) ||
      (navigator.platform.indexOf("iPad") !== -1)){
      window.open("maps://maps.google.com/maps?daddr=universidade+sao+judas+tadeu");
    } else {/* else use Google */
      window.open("https://maps.google.com/maps?daddr=universidade+sao+judas+tadeu");
    }
  }

  render(){
     if(this.state.user == null || this.state.user === "gestor"){
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
                        <li className="breadcrumb-item active">Visão geral</li>
                      </ol>

                      <h3>Visão geral</h3>
                      <hr/>
                      <div className="container">
                        <div className="row row-striped" onClick={this.mostrarDetalhes.bind(this)}>
                          <div className="col-2 text-right">
                            <p className="display-4"><span className="badge badge-secondary">23</span></p>
                            <h5>OCT</h5>
                          </div>
                          <div className="col-10">
                            <h4 className="text-uppercase"><strong>Atividade 1</strong></h4>
                            <ul className="list-inline">
                              <li className="list-inline-item"><i className="fa fa-calendar-o" aria-hidden="true"></i>Monday</li>
                              <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i>12:30 PM - 2:00 PM</li>
                              <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i> <a className="atividade-localizacao" onClick={this.mapsSelector.bind(this)}> São Judas Tadeu - Butantã </a></li>
                            </ul>
                            <p>Lorem ipsum dolsit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                          </div>
                        </div>
                        <hr/>
                        <div className="row row-striped">
                          <div className="col-2 text-right">
                            <p className="display-4"><span className="badge badge-secondary">23</span></p>
                            <h5>OCT</h5>
                          </div>
                          <div className="col-10">
                            <h4 className="text-uppercase"><strong>Atividade 2</strong></h4>
                            <ul className="list-inline">
                              <li className="list-inline-item"><i className="fa fa-calendar-o" aria-hidden="true"></i>Monday</li>
                              <li className="list-inline-item"><i className="fa fa-clock-o" aria-hidden="true"></i>12:30 PM - 2:00 PM</li>
                              <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i> Cafe</li>
                            </ul>
                            <p>Lorem ipsum dolsit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                          </div>
                        </div>
                        <hr/>
                      </div>
                    </div>
                    <FooterTemplate/>
                </div>
          </div>
          );
  }
}
