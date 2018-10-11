import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import axios from 'axios';
import ButtonAtividade from './buttonAtividade';
import { ToastContainer, toast } from 'react-toastify';
import {URL} from '../../global'
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
    this.token = user.token.numero
    this.toggle = this.toggle.bind(this);
    this.changeStatus = this.changeStatus.bind(this)
    this.state = {
      modal:false,
      atividade:{},
      idAtividade:0,
      comentario:""};
    if(usuario == null){
      this.usuario = null
    }

    else{
      this.usuario = user.perfilAcesso
    }  
  }

  componentDidMount(){
    const idAtividade = sessionStorage.getItem('idAtividadeAnalista')
    this.setState({...this.state,idAtividade:idAtividade})
    var config = {headers:{Authorization:this.token}};
    axios.get(`${URL}atividade/analista/detalhe/${idAtividade}`,config)
          .then(resp=> this.setState({...this.state,atividade:resp.data.response}))

  }

  changeStatus(){
    var options = {
        enableHighAccuracy: false,
        maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      console.log(crd.latitude);
      console.log(crd.longitude);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
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

  setComentario(event){
    console.log(event.target.value)
    this.setState({comentario:event.target.value})
  }

  enviarComentario(){
      var config = {headers:{Authorization:this.token}};
      const json = {comentario:this.state.comentario,atividade:{id:this.state.idAtividade}}
      console.log(json)
      axios.post(`${URL}comentario/analista/cadastrar`,json,config)
      .then(resp => toast.success('Comentário realizado com sucesso!', 
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })).then(resp=> this.setState({...this.state,comentario:""}))
      .catch(err => toast.error('Não foi possível comentar nessa atividade, tente novamente.',{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            }))

      this.closeModal('modal2')
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
                          <h5 className="card-title">{this.state.atividade.nome}</h5>
                          <p className="card-text">
                            {this.state.atividade.descricao}
                          </p>
                          <p className="card-text"><small className="text-muted"><strong>Data de criação:</strong>{this.state.atividade.dataCriacao} -  
                          <strong> Data de Entrega:</strong> {this.state.atividade.dataEntrega}  </small></p>
                        </div>
                      </div>
                      <ButtonAtividade 
                          button={this.changeStatus}
                          status={this.state.atividade.status}/>
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
                        <Input type="textarea" onChange={this.setComentario.bind(this)} value={this.state.comentario} name="text" id="inputComentario" />
                        <Button color="btn btn-success float-right mt-2" onClick={this.enviarComentario.bind(this)}>Adicionar</Button>
                      </ModalBody>
                    </Modal>

                     <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnVisibilityChange
                      draggable
                      pauseOnHover
                      />
                      {/* Same as */}
                      <ToastContainer />

      </div>
    );
  }
}
