import React, { Component } from 'react';
import {Redirect } from 'react-router-dom';
import FooterTemplate from '../../components/footer'
import NavbarTemplate from '../../components/navbar'
import SidebarTemplate from '../../components/sidebar'
import axios from 'axios'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,ModalFooter } from 'reactstrap';


const URL = `http://localhost:8080/`

export default class DetalheProjeto extends Component {
  	constructor(props){
    super(props);
      var usuario = localStorage.getItem('user');
      const user = JSON.parse(usuario);
      this.usuario = user
      
      this.state = {modal: false,projeto:{},atividades:[]};
      this.toggle = this.toggle.bind(this);
      if(usuario == null){
        this.usuario = null
      }else{
        this.usuario = user.perfilAcesso
      }
  	}

    componentDidMount(){
      const id = sessionStorage.getItem('idProjeto', id);
      var config = {headers:{Authorization:this.token}};
      axios.get(`${URL}projeto/gestor/buscaid/${id}`,config)
      .then(resp=> this.setState({projeto:resp.data.response,atividades:resp.data.response.atividades}))
      
    }


    teste(){
      console.log(this.state.projeto)
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

	atividade(){
		 this.props.history.push("/atividades");
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
                      <li className="breadcrumb-item active">Atividades</li>
                    </ol>

                    <div className="container mb-3">
                      <h3 className="d-inline-block">{this.state.projeto.nome}</h3>
                      <button className="btn btn-success float-right" onClick={this.showModal.bind(this, 'adicionar_atividade')}><i className="fas fa-plus fa-1x"></i> Adicionar nova atividade</button>
                      <div className="clearfix"/>
                      <hr/>
                      
                      {
                        this.state.atividades.map(function(atividade){
                              return(
                              <div className="card margin-bottom-card-atividades">
                              <div className="card-header">
                                <strong> {atividade.nome} - </strong> <em> {atividade.status}</em><a className="fas fa-lg fa-edit float-right editar-atividade" onClick={this.showModal.bind(this, 'editar_atividade')}></a>
                              </div>
                              <div className="card-body">
                                <p className="card-text">
                                {atividade.descricao}
                                </p>
                                <button className="btn btn-primary float-right" onClick={this.atividade.bind(this)}>Visualizar</button>
                              </div>
                              <div className="card-footer text-muted">
                                {atividade.dataCriacao} - {atividade.dataEntrega}
                              </div>
                            </div>
                              );
                          }.bind(this))
                      }

                
                      <Modal isOpen={this.state.adicionar_atividade} toggle={this.closeModal.bind(this, 'adicionar_atividade')} className={this.props.className}>
                        <ModalHeader toggle={this.closeModal.bind(this, 'adicionar_atividade')}>Adicionar nova atividade</ModalHeader>
                        <ModalBody>
                          <form>
                            <div className="form-row">
                              <div className="form-group col-md-12">
                                <label htmlFor="inputNomeAtividade">Nome da atividade:</label>
                                <Input type="text" className="form-control" id="inputNomeAtividade" placeholder="Nome da atividade"/>
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputDescricaoAtividade">Descrição:</label>
                                <Input type="textarea" className="form-control" name="text" id="inputDescricaoAtividade" placeholder="Descrição"/>
                              </div>
                            </div>
                          </form>
                          <button className="btn btn-success float-right mt-2">Cadastrar</button>
                        </ModalBody>
                      </Modal>

                      <Modal isOpen={this.state.editar_atividade} toggle={this.closeModal.bind(this, 'editar_atividade')} className={this.props.className}>
                        <ModalHeader toggle={this.closeModal.bind(this, 'editar_atividade')}>
                          <Input type="text" className="form-control borda_input" id="inputNomeAtividade" placeholder="Nome atividade" value="Atividade A"/>
                        </ModalHeader>
                        <ModalBody>
                          <form>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-7">
                                <div className="form-group">
                                  <label htmlFor="inputDescricaoAtividade">Descrição:</label>
                                  <Input type="textarea" name="text" id="inputDescricaoAtividade" placeholder="Descrição"/>
                                  <br/>
                                  <label htmlFor="inputComentarioAtividade">Comentário:</label>
                                  <Input type="textarea" name="text" id="inputComentarioAtividade" placeholder="Comentário"/>
                                </div>
                              </div>
                              <div className="col-md-5 text-center">
                                <label>Dificuldade: </label>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star"></span>
                                <br/>
                                <Input type="date" name="date" />
                                <br/>
                                <Input type="button" className="btn btn-primary" name="analistas" value="Analista"/>
                                <br/>
                                <br/>
                                <Input type="button" className="btn btn-primary" name="analistas" value="Anexo"/>
                              </div>
                            </div>
                          </form>
                        </ModalBody>
                        <ModalFooter>
                          <button className="btn btn-success float-right mt-2">Salvar</button>
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
