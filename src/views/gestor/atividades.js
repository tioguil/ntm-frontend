import React, { Component } from 'react';
import axios from 'axios'
import {Redirect,Link } from 'react-router-dom';
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input } from 'reactstrap';

const URL = `http://localhost:8080/`

export default class Atividades extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.token = user.token.numero
    this.state = {modal: false,atividade:{},alocados:[]};
    this.toggle = this.toggle.bind(this);
    if(usuario == null){
      this.usuario = null
    }
    else{
      this.usuario = user.perfilAcesso
    }
    
  }
  componentDidMount(){
    const id = sessionStorage.getItem('idAtividade', id);
    var config = {headers:{Authorization:this.token}};
      axios.get(`${URL}atividade/analista/detalhe/${id}`,config)
      // .then(resp => console.log(resp.data.response))
      .then(resp=> this.setState(...this.state,{atividade:resp.data.response,alocados:resp.data.response.historicoAlocacao}))
    
  }
  closeModal(tabId){
    this.setState({
      [tabId]: false
    });
  }

  showModal(modal){
    this.setState({
      [modal]: true
    });
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  btn_detalheAnalista(){

    this.props.history.push("/detalheAnalista");
  }

   mapsSelector() {
   const endereco=  this.state.atividade.endereco
   const numero = this.state.atividade.enderecoNumero

    if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf("iPhone") !== -1) ||
      (navigator.platform.indexOf("iPod") !== -1) ||
      (navigator.platform.indexOf("iPad") !== -1)){
      window.open("maps://maps.google.com/maps?daddr=" +endereco + numero);
    } else {/* else use Google */
      window.open("https://maps.google.com/maps?daddr="+ endereco + numero);
    }
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
              <div className="col content-wrapper">
              <br/>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/dashboardAdmin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/listarProjetos">Listar Projetos</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/detalheProjeto">Atividades</Link>
                    </li>
                    <li className="breadcrumb-item active">Detalhar atividade</li>
                  </ol>

                  <div className="container">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item">
                        <a className="nav-link active" id="home-tab" data-toggle="tab" href="#detail" role="tab" aria-controls="home" aria-selected="true">Detalhes</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" id="profile-tab" data-toggle="tab" href="#members" role="tab" aria-controls="profile" aria-selected="false">Analistas</a>
                      </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                      <div className="tab-pane fade show active" id="detail" role="tabpanel" aria-labelledby="home-tab">

                        <div className="atividade-projeto">
                          <h3 className="inline-projeto">{this.state.atividade.nome}</h3> <i className="inline-projeto color-p-projeto"> - {this.state.atividade.dataEntrega} </i>
                          <div>
                            <i className="inline-projeto color-p-projeto">{this.state.atividade.status} </i>
                            complexidade:{this.state.atividade.complexidade}
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star"></span>
                          </div>
                          <p className="descript">
                            {this.state.atividade.descricao}
                          </p>
                          <div className="location-margin">

                            <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i> <a className="atividade-localizacao" onClick={this.mapsSelector.bind(this)}> {this.state.atividade.endereco}, {this.state.atividade.enderecoNumero}, {this.state.atividade.cidade}- 
                            {this.state.atividade.uf} - {this.state.atividade.cep} </a></li>
                          </div>
                        </div>
                      </div>



                      <div className="tab-pane fade" id="members" role="tabpanel" aria-labelledby="profile-tab">
                        <div className="card-group row members-margin">  
                        {
                          this.state.alocados.map(function(analista){
                          return( <div className="card col-md-3 no-margin" onClick={this.btn_detalheAnalista.bind(this)}>
                            <div className="card-body">
                              <h5 className="card-title">{analista.usuario.nome} {analista.usuario.sobreNome}</h5>
                                <p className="card-text">
                                  <li> {analista.usuario.celular} </li>
                                  <li> {analista.usuario.telefone} </li>
                                </p>
                            </div>
                            <div className="card-footer">
                              <div className="text-muted">{analista.usuario.cidade}-{analista.usuario.uf}</div>
                            </div>
                          </div>
                          );
                        }.bind(this))
                      } 
                        <div className="card col-md-3 no-margin color-plus" onClick={this.showModal.bind(this, 'modal1')}>
                          <div className="card-body">
                            <p className="card-text text-center">
                              <i className="fas fa-plus fa-5x color-fa-atividade"></i></p>
                              <p className="text-center members-font" >Adicionar Analistas</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                      <Modal isOpen={this.state.modal1} toggle={this.closeModal.bind(this, 'modal1')} className={this.props.className}>
                        <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'modal1')}>Adicionar novos Analistas</ModalHeader>
                        <ModalBody className="card-header" >
                          <form >
                            <div className="form-row">
                              <div className="col-md-12">
                                <label htmlFor="inputNomeAtividade">Buscar Analista:</label>
                                <Input type="text" className="form-control" id="inputNomeAtividade" placeholder="Ex:Buscar por nome, localização, habilidades ou cargo.."/>
                              </div>
                              </div>
                          </form>
                        </ModalBody>
                        <ModalFooter className="card-header" >
                          <Button color="success">Adicionar</Button>
                          <Button color="primary" onClick={this.closeModal.bind(this, 'modal1')}>Fechar</Button>
                        </ModalFooter>
                      </Modal>
                    </div>  
                    
                  </div>
                  <FooterTemplate/>
              </div>
            
        </div>
    );
  }
}
