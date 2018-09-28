import React, { Component } from 'react';
import {Redirect,Link } from 'react-router-dom';
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
      this.state = {modal: false,projeto:{},atividades:[],atividade:{}};
      this.toggle = this.toggle.bind(this);
      this.activity = {}
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
  	closeModal(tabId){
    	this.setState({
     	 [tabId]: false
    	});
  	}

  	showModal(modal){
      if(modal == 'adicionar_atividade'){
        this.setState({
        [modal]: true
      });
      }
      else{ 
          this.setState({['editar_atividade']: true, 
    	 });
          this.activity = modal
      }
  	}

  	toggle(){
    	this.setState({
      	modal: !this.state.modal

    	});
  	}

  	atividade(id){
    
      sessionStorage.setItem('idAtividade', id);
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
              <br/>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/dashboardAdmin">Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">
                        <Link to="/listarProjetos">Listar Projetos</Link>
                      </li>
                      <li className="breadcrumb-item active">Atividades</li>
                    </ol>

                    <div className="container mb-3">
                      <h3 className="d-inline-block">{this.state.projeto.nome}</h3>
                      <button className="btn btn-success float-right" onClick={this.showModal.bind(this, 'adicionar_atividade')}><i className="fas fa-plus fa-1x"></i> Adicionar nova atividade</button>
                      <div className="clearfix"/>
                      <hr/>
                      <div className="detalhe-projeto table-wrapper-scroll-y">
                      {
                        this.state.atividades.map(function(atividade){
                              return(
                              <div key={atividade.id}className="card margin-bottom-card-atividades">
                              <div className="card-header">
                                <strong> {atividade.nome} - </strong> <em> {atividade.status}</em><a className="fas fa-lg fa-edit float-right editar-atividade" onClick={this.showModal.bind(this,atividade)}></a>
                              </div>
                              <div className="card-body">
                                <p className="card-text">
                                {atividade.descricao}
                                </p>
                                <button className="btn btn-primary float-right" onClick={this.atividade.bind(this,atividade.id)}>Visualizar</button>
                              </div>
                              <div className="card-footer text-muted">
                                {atividade.dataCriacao} - {atividade.dataEntrega}
                              </div>
                            </div>
                              );
                          }.bind(this))
                      }
                      </div>
                
                      <Modal isOpen={this.state.adicionar_atividade} toggle={this.closeModal.bind(this, 'adicionar_atividade')}className="modal-dialog modal-lg">
                        <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'adicionar_atividade')}>Adicionar nova atividade</ModalHeader>
                        <ModalBody className="card-header" >
                          <form >
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label htmlFor="inputNomeAtividade">Nome da atividade:</label>
                                <Input type="text" className="form-control" id="inputNomeAtividade" placeholder="Nome da atividade"/>
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="inputDate">Data de entrega:</label>
                                <Input type="date" className="form-control" id="inputDate"/>
                              </div>
                              <div className="form-group col-md-6">
                              <label>Dificuldade:</label>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star"></span>
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputDescricaoAtividade">Descrição:</label>
                                <Input type="textarea" className="form-control" name="text" id="inputDescricaoAtividade" placeholder="Descrição"/>
                              </div>
                              <div className="form-group col-md-8">
                                <label htmlFor="inputEndereco">Endereço:</label>
                                <Input type="text" className="form-control" id="inputEndereco" placeholder="Ex.:Rua/Av.."/>
                              </div>
                               <div className="form-group col-md-4">
                                <label htmlFor="inputEnderecoNumero">Nº:</label>
                                <Input type="text" className="form-control" id="inputEnderecoNumero" placeholder="EX.:123"/>
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputComplemento">Complemento:</label>
                                <Input type="text" className="form-control" id="inputComplemento" placeholder="Ex.:Casa/Apto"/>
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputCidade">Cidade:</label>
                                <Input type="text" className="form-control" id="inputCidade" placeholder="Ex.:São Paulo"/>
                              </div>
                              <div className="form-group col-md-2">
                                <label htmlFor="inputCEP">CEP:</label>
                                <Input type="text" className="form-control" id="inputCEP" placeholder="00000-000"/>
                              </div>
                                <div className="form-group col-md-4">
                                  <label htmlFor="inputEstado"className="required">UF:</label>
                                    <select id="inputEstado"  className="form-control">
                                      <option selected>Selecione o estado</option>
                                      <option>AC</option>
                                      <option>AL</option>
                                      <option>AP</option>
                                      <option>AM</option>
                                      <option>BA</option>
                                      <option>CE</option>
                                      <option>DF</option>
                                      <option>ES</option>
                                      <option>GO</option>
                                      <option>MA</option>
                                      <option>MT</option>
                                      <option>MS</option>
                                      <option>MG</option>
                                      <option>PA</option>
                                      <option>PB</option>
                                      <option>PR</option>
                                      <option>PE</option>
                                      <option>PI</option>
                                      <option>RJ</option>
                                      <option>RN</option>
                                      <option>RS</option>
                                      <option>RO</option>
                                      <option>RR</option>
                                      <option>SC</option>
                                      <option>SP</option>
                                      <option>SE</option>
                                      <option>TO</option>
                                    </select>
                                </div>
                            </div>
                          </form>
                        </ModalBody>
                        <ModalFooter className="card-header" >
                          <button className="btn btn-success float-right mt-2">Cadastrar</button>
                        </ModalFooter>
                      </Modal>

                      <Modal isOpen={this.state.editar_atividade} toggle={this.closeModal.bind(this, 'editar_atividade')} className="modal-dialog modal-lg">
                        <ModalHeader className="card-header"  toggle={this.closeModal.bind(this, 'editar_atividade')}>Editar Atividade</ModalHeader>
                          <ModalBody className="card-header" >
                          <form >
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label htmlFor="inputNomeAtividade">Nome da atividade:</label>
                                <Input type="text" className="form-control" id="inputNomeAtividade" value={this.activity.nome} onChange=""/>
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor="inputDate">Data de entrega:</label>
                                <Input type="date" className="form-control"  value={this.activity.dataEntrega} id="inputDate"/>
                              </div>
                              <div className="form-group col-md-6">
                              <label>Dificuldade:</label>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star"></span>
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputDescricaoAtividade">Descrição:</label>
                                <Input type="textarea" className="form-control" name="text" id="inputDescricaoAtividade" value={this.activity.descricao}/>
                              </div>
                              <div className="form-group col-md-8">
                                <label htmlFor="inputEndereco">Endereço:</label>
                                <Input type="text" className="form-control" id="inputEndereco" value={this.activity.endereco}/>
                              </div>
                               <div className="form-group col-md-4">
                                <label htmlFor="inputEnderecoNumero">Nº:</label>
                                <Input type="text" className="form-control" id="inputEnderecoNumero" value={this.activity.enderecoNumero}/>
                              </div>
                              <div className="form-group col-md-4">
                                <label htmlFor="inputComplemento">Complemento:</label>
                                <Input type="text" className="form-control" id="inputComplemento" value={this.activity.complemento}/>
                              </div>
                              <div className="form-group col-md-4">
                                <label htmlFor="inputCidade">Cidade:</label>
                                <Input type="text" className="form-control" id="inputCidade" value={this.activity.cidade}/>
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputCEP">CEP:</label>
                                <Input type="text" className="form-control" id="inputCEP" value={this.activity.cep}/>
                              </div>
                                <div className="form-group col-md-1">
                                  <label htmlFor="inputEstado"className="required">UF:</label>
                                    <select id="inputEstado"  className="form-control">
                                      <option selected>{this.activity.uf}</option>
                                      <option>AC</option>
                                      <option>AL</option>
                                      <option>AP</option>
                                      <option>AM</option>
                                      <option>BA</option>
                                      <option>CE</option>
                                      <option>DF</option>
                                      <option>ES</option>
                                      <option>GO</option>
                                      <option>MA</option>
                                      <option>MT</option>
                                      <option>MS</option>
                                      <option>MG</option>
                                      <option>PA</option>
                                      <option>PB</option>
                                      <option>PR</option>
                                      <option>PE</option>
                                      <option>PI</option>
                                      <option>RJ</option>
                                      <option>RN</option>
                                      <option>RS</option>
                                      <option>RO</option>
                                      <option>RR</option>
                                      <option>SC</option>
                                      <option>SP</option>
                                      <option>SE</option>
                                      <option>TO</option>
                                    </select>
                                </div>
                            </div>
                          </form>
                        </ModalBody>
                        <ModalFooter className="card-header" >
                          <button className="btn btn-success float-right mt-2">Salvar</button>
                        </ModalFooter>
                      </Modal>
                    </div>
                    
        </div>
    );
  }
}
