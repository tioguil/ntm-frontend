import React, { Component } from 'react';
import {Redirect } from 'react-router-dom';
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'reactstrap';


export default class Atividades extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.state = {modal: false};
    this.toggle = this.toggle.bind(this);
    if(usuario == null){
      this.usuario = null
    }
    else{
      this.usuario = user.perfilAcesso
    }
    
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
                      <a href="/dashboardAdmin">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active">
                      <a href="/listarProjetos">Listar Projetos</a>
                    </li>
                    <li className="breadcrumb-item active">
                      <a href="/detalheProjeto">Atividades</a>
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
                          <h3 className="inline-projeto">Atividade A</h3> <i className="inline-projeto color-p-projeto"> - criado em 30/02/2018 </i>
                          <div>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star"></span>
                          </div>
                          <p className="descript">
                            Et et consectetur ipsum labore excepteur est proident excepteur ad velit
                            occaecat qui minim occaecat veniam. Fugiat veniam incididunt anim aliqua enim
                            pariatur veniam sunt est aute sit dolor anim. Velit non irure adipisicing aliqua
                            ullamco irure incididunt irure non esse consectetur nostrud minim non minim occaecat.
                            Amet duis do nisi duis veniam non est eiusmod tempor incididunt tempor dolor ipsum in qui sit.
                            Exercitation mollit sit culpa nisi culpa non adipisicing reprehenderit do dolore.
                            Duis reprehenderit occaecat anim ullamco ad duis occaecat ex.
                            Et et consectetur ipsum labore excepteur est proident excepteur ad velit
                            occaecat qui minim occaecat veniam. Fugiat veniam incididunt anim aliqua enim
                            pariatur veniam sunt est aute sit dolor anim. Velit non irure adipisicing aliqua
                            ullamco irure incididunt irure non esse consectetur nostrud minim non minim occaecat.
                            Amet duis do nisi duis veniam non est eiusmod tempor incididunt tempor dolor ipsum in qui sit.
                            Exercitation mollit sit culpa nisi culpa non adipisicing reprehenderit do dolore.
                            Duis reprehenderit occaecat anim ullamco ad duis occaecat ex.
                          </p>
                          <div className="location-margin">
                            <strong> São Judas Tadeu - Butantã <li className="list-inline-item"><i className="fa fa-location-arrow" aria-hidden="true"></i></li> </strong>
                          </div>

                        </div>
                      </div>
                      <div className="tab-pane fade" id="members" role="tabpanel" aria-labelledby="profile-tab">
                        <div className="card-group row members-margin">
                          
                          <div className="card col-md-3 no-margin" onClick={this.btn_detalheAnalista.bind(this)}>
                            <div className="card-body">
                              <h5 className="card-title">Analista A</h5>
                              <p className="card-text">analistaa@empresa.com.br.</p>
                            </div>
                            <div className="card-footer">
                              <small className="text-muted">São Paulo</small>
                            </div>
                          </div>
                          <div className="card col-md-3 no-margin">
                            <div className="card-body">
                              <h5 className="card-title">Analista B</h5>
                              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            </div>
                            <div className="card-footer">
                              <small className="text-muted">São Paulo</small>
                            </div>
                          </div>
                          

                          <div className="card col-md-3 no-margin">
                            <div className="card-body">
                              <h5 className="card-title">Analista C</h5>
                              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            </div>
                            <div className="card-footer">
                              <small className="text-muted">São Paulo</small>
                            </div>
                          </div>
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
                        <ModalHeader toggle={this.closeModal.bind(this, 'modal1')}>Adicionar novos Analistas</ModalHeader>
                        <ModalBody>
                          <input type="text" classname="form-control" placeholder="Buscar Analistas"/>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="success">Adicionar</Button>
                          <Button color="primary" onClick={this.closeModal.bind(this, 'modal1')}>Fechar</Button>

                        </ModalFooter>
                      </Modal>
                    </div>  
                    <FooterTemplate/>
                  </div>
              </div>
            
        </div>
    );
  }
}
