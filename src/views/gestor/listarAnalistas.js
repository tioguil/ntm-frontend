import React, { Component } from 'react';
import {Redirect,Link } from 'react-router-dom';
import { Input } from 'reactstrap';
import axios from 'axios'
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'


const URL = `http://localhost:8080/`

export default class ListarAnalistas extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.token = user.token.numero
    this.state = {analistas:[],chave:""}
    this.search = this.search.bind(this)
    if(usuario == null){
      this.usuario = null
    }else{
      this.usuario = user.perfilAcesso
    }
  }

  analista_detalhes(id){
    console.log(id)
    this.props.history.push("/detalheAnalista");
  }

  search(event){
    this.setState({chave:event.target.value})
    var config = {headers:{Authorization:this.token}};
    axios.get(`${URL}usuario/gestor/pesquisar/${this.state.chave}`,config)
      .then(resp=> this.setState({analistas:resp.data.response}))
  }

  render(){
    if(this.usuario == null || this.usuario === "analista"){
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
                    <li className="breadcrumb-item active">Listar Analistas</li>
                  </ol>
                  <div className="form-group col-md-8">
                          <h3>Pesquisar Analista</h3>
                          <Input type="text" onChange={this.search} value={this.state.chave} className="form-control" id="inputAnalistas" placeholder="Pesquisar por email, nome, cargo, habilidade..."/>
                        </div>
                  <hr/>
                  <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
                    <thead>
                      <tr>
                        <th className="th-sm">Email<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Nome<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Cargo<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Cidade<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                          this.state.analistas.map(function(analista){
                            return (
                                <tr key={analista.id} onClick={() => this.analista_detalhes(analista.id)} >
                                  <td> {analista.email} </td>
                                  <td>{analista.nome}</td>
                                  <td> {analista.cargo.cargo}</td>
                                  <td></td>
                                </tr>
                              );

                            }.bind(this))
                        } 
                    </tbody>
                  </table>
              </div>
              <FooterTemplate/>
            </div>
      </div>
    );
  }
}
