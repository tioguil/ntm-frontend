import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input } from 'reactstrap';

export default class DetalheAtividade extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.toggle = this.toggle.bind(this);
    this.state = { modal: false};
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

  visualizar(){
    this.props.history.push("/visualizarComentarios");
  }

  render(){
    if(this.usuario == null || this.usuario === "gestor"){
      return (
         <Redirect to ="/"/>
        );
      }
    return (
      <div>
              <br/>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/Dashboard">Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">Atividade</li>
                    </ol>

                    <div className="text-center">
                      <div className="card card_body">
                        <div className="card-body">
                          <h5 className="card-title">Nome da atividade</h5>
                          <p className="card-text">
                          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                          </p>
                          <p className="card-text"><small className="text-muted">Data de criação: 11/03/2018</small></p>
                        </div>
                      </div>

                      <div className="contador mt-2">
                        <i className="far fa-play-circle fa-8x play"></i>
                        {/*<i className="far fa-stop-circle fa-8x stop"></i>*/}
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-xl-4 col-sm-6 mb-3">
                        <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.showModal.bind(this, 'modal1')}>
                          <div className="card-body">
                            <div className="card-body-icon-activities">
                              <i className="fas fa-paperclip anexo"></i>/<i className="fas fa-fw fa-image"></i>
                            </div>
                          </div>
                          <div className="card-footer text-white clearfix z-1">
                            <span className="float-left">Anexar</span>
                            <span className="float-right">
                              <i className="fas fa-angle-right"></i>
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="col-xl-4 col-sm-6 mb-3">
                        <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.visualizar.bind(this)}>
                          <div className="card-body">
                            <div className="card-body-icon-activities">
                              <i className="fas fa-comment-alt detalhes"></i>
                            </div>
                          </div>
                          <div className="card-footer text-white clearfix z-1">
                            <span className="float-left">Visualizar comentários</span>
                            <span className="float-right">
                              <i className="fas fa-angle-right"></i>
                            </span>
                          </div>
                        </a>
                      </div>
                      <div className="col-xl-4 col-sm-6 mb-3">
                        <a className="card text-white bg-secondary o-hidden h-100" href="#" onClick={this.showModal.bind(this, 'modal2')}>
                          <div className="card-body">
                            <div className="card-body-icon-activities">
                              <i className="fas fa-plus-circle"></i>
                            </div>
                          </div>
                          <div className="card-footer text-white clearfix z-1">
                            <span className="float-left">Novo comentário</span>
                            <span className="float-right">
                              <i className="fas fa-angle-right"></i>
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>

                    <Modal isOpen={this.state.modal1} toggle={this.closeModal.bind(this, 'modal1')} className={this.props.className}>
                      <ModalHeader toggle={this.closeModal.bind(this, 'modal1')}>Anexar arquivo</ModalHeader>
                      <ModalBody>
                        Selecione o anexo: <input type="file" name="myFile"/>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={this.closeModal.bind(this, 'modal1')}>Fechar</Button>
                      </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.modal2} toggle={this.closeModal.bind(this, 'modal2')} className={this.props.className}>
                      <ModalHeader toggle={this.closeModal.bind(this, 'modal2')}>Novo comentário</ModalHeader>
                      <ModalBody>
                        <Input type="textarea" name="text" id="inputComentario" />
                        <Button color="btn btn-success float-right mt-2" onClick={this.closeModal.bind(this, 'modal2')}>Adicionar</Button>
                      </ModalBody>
                    </Modal>
      </div>
    );
  }
}
