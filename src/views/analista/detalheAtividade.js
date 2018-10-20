import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import { Line } from 'rc-progress';
import ReactStars from 'react-stars'
import axios from 'axios';
import ButtonAtividade from './buttonAtividade';
import { ToastContainer, toast } from 'react-toastify';
import HorarioTrabalho from './horarioTrabalho';
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
    this.usuario = user;
    this.token = user.token.numero;
    this.toggle = this.toggle.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.fileSelected = this.fileSelected.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.atualizarHorarioTrabalho = this.atualizarHorarioTrabalho.bind(this);
    this.downloadAnexo = this.downloadAnexo.bind(this);

    this.state = {
      modal: false,
      atividade: {},
      idAtividade: 0,
      comentario: "",
      horarioTrabalho: [],
      totalTrabalho: "",
      anexo: [],
      progressUpload: 0
    };

    if(usuario == null){
      this.usuario = null;
    } else {
      this.usuario = user.perfilAcesso;
    }
  }

  componentDidMount(){
    this.getLocation()
    const idAtividade = sessionStorage.getItem('idAtividadeAnalista')
    
    this.setState(
      {
        ...this.state,
        idAtividade: idAtividade
      }
    );

    var config = {
      headers: {
        Authorization: this.token
      }
    };

    axios.get(`${URL}atividade/analista/detalhe/${idAtividade}`, config)
      .then(resp => this.setState(
          {
            ...this.state,
            atividade: resp.data.response
          }
        )
      );

    axios.get(`${URL}historico-trabalho/analista/lista-horario/${idAtividade}`, config)
      .then(resp => this.setState(
          {
            ...this.state,
            horarioTrabalho: resp.data.response,
            totalTrabalho: resp.data.message
          }
        )
      );
      axios.get(`${URL}anexo/analista/list/${idAtividade}`, config).then(resp => this.setState(
          {
              ...this.state,
              anexo: resp.data.response
          }
          )
      )
  }

  atualizarHorarioTrabalho(){
    var config = {
      headers: {
        Authorization: this.token
      }
    };
    
    axios.get(`${URL}historico-trabalho/analista/lista-horario/${this.state.idAtividade}`,config)
      .then(resp => this.setState(
          {
            ...this.state,
            horarioTrabalho: resp.data.response,
            totalTrabalho: resp.data.message
          }
        )
      );
  }

  getLocation(){
    var options = {
      enableHighAccuracy: false,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
    function success(pos) {
      var crd = pos.coords;
      var json = JSON.stringify(
        {
          latitude: crd.latitude,
          longitude: crd.longitude
        }
      );
      sessionStorage.setItem("location", json);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  }

  closeModal(tabId){
    this.setState({
      [tabId]: false
    });
  }

  fileSelected (event){
    this.setState(
      {
        ...this.state, 
        anexo: event.target.files[0]
      }
    );
  }

  fileUpload(){
    const formData = new FormData();
    formData.append('anexo', this.state.anexo, this.state.anexo.name);
    formData.append('idAtividade', this.state.atividade.id);
    var config = {
      headers: {
        Authorization: this.token
      },
      onUploadProgress: progressEvent => {
        this.setState(
          {
            ...this.state, 
            progressUpload: Math.round(progressEvent.loaded / progressEvent.total * 100)
          }
        )
      }
    };
    axios.post(`${URL}anexo/analista/upload`,formData,config)
      .then(resp => console.log(resp.data));
  }

  downloadAnexo(localArmazenamento){
      console.log(localArmazenamento)
    axios({
      url: URL+'anexo/analista/download/'+localArmazenamento,
      method: 'GET',
      responseType: 'blob', // important
      headers: {
        Authorization:this.token
      }
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log(response)
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', localArmazenamento);
        document.body.appendChild(link);
        link.click();
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
    console.log(event.target.value);
    this.setState({
      comentario:event.target.value
    });
  }

  changeStatus(id){
    var coord = JSON.parse(sessionStorage.getItem("location"))
    var config = {headers:{Authorization:this.token}};
    let json; 

    if(coord == null){
      json = {
        atividade: {
          id: this.state.idAtividade
        },
        latitude: "",
        longitude: ""
      }
    } else {
      json = {
        atividade: {
          id: this.state.idAtividade
        },
        latitude: coord.latitude,
        longitude: coord.longitude
      }
    }

    if(id==null){
      axios.post(`${URL}historico-trabalho/analista/registrar`, json, config)
        .then(resp => console.log(resp.data))
        .then(resp => this.atualizarHorarioTrabalho())
    }
    else{
      const pause = {
        id: id,
        atividade: {
          id: this.state.idAtividade
        }
      }
      axios.post(`${URL}historico-trabalho/analista/finalizar-trabalho`, pause, config)
        .then(resp => console.log(resp.data))
        .then(resp => this.atualizarHorarioTrabalho())
    }
  }

  finalizarAtividade(){
    var config = {
      headers: {
        Authorization: this.token
      }
    };
    var json = { id: this.state.idAtividade }
    axios.post(`${URL}atividade/analista/finalizar`,json,config)
      .then(resp => this.setState(
          {
            ...this.state,
            atividade: resp.data.response
          }
        )
      )
      .then(resp => this.atualizarHorarioTrabalho())
    this.closeModal('modal3');
  }

  enviarComentario(){
    var config = {
      headers: {
        Authorization: this.token
      }
    };

    const json = {
      comentario: this.state.comentario,
      atividade: {
        id: this.state.idAtividade
      }
    }
    console.log(json);
    axios.post(`${URL}comentario/analista/cadastrar`, json, config)
      .then(resp => toast.success('Comentário realizado com sucesso!',
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          }
        )
      )
      .then(resp=> this.setState(
          {
            ...this.state,
            comentario:""
          }
        )
      )
      .catch(err => toast.error('Não foi possível comentar nessa atividade, tente novamente.',
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          }
        )
      );

    this.closeModal('modal2');
  }

  render(){

    const listaAnexo = () => {
      let list = this.state.anexo
        return list.map(anexo => (
            <tr key={anexo.id}>
                <td>{anexo.nomeAquivo}</td>
                <td>{anexo.tamanho}</td>
                <td>{anexo.usuario.nome}</td>
                <td><button className="btn btn-outline-dark" onClick={()=> {this.downloadAnexo((anexo.localArmazenamento + anexo.nomeAquivo))}}>Baixar</button></td>
            </tr>
        ))

    }

    console.log(this.state.anexo)
    if(this.usuario == null || this.usuario === "gestor") {
      return (
        <Redirect to ="/"/>
      );
    }

    const buttonFinalizar = () => {
      {
        if(this.state.atividade.status == 'finalizada'){
          return(<button onClick={this.showModal.bind(this, 'modal3')} className="btn btn-danger" style={{"float": "right"}} disabled>Finalizar atividade</button>)
        } else {
          return(
            <button onClick={this.showModal.bind(this, 'modal3')} className="btn btn-danger" style={{"float": "right"}}>Finalizar atividade</button>
          )
        }
      }
    }

    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Atividade</li>
        </ol>
        <div className="row">
          <div className="col-md-12">
            <span style={{"font-size":"20px"}}>
            {this.state.atividade.nome} <i> {(this.state.atividade.status ==='finalizada'? '(finalizada)':'')} </i>
            </span>
            <div>
              <ReactStars
                count={5}
                value={this.state.atividade.complexidade}
                size={22}
                edit={false}
                color2={'#ffd700'} />
            </div>
            {buttonFinalizar()}
            <br/>
            <small className="text-muted">
            <strong>Criação: </strong>{this.state.atividade.dataCriacao} -
            <strong> Entrega: </strong> {this.state.atividade.dataEntrega}
            </small>
            <hr/>
          </div>

          <div className="col-md-6">
            <label style={{"font-size":"12px"}}>Descrição</label>
            <div className="card-detail-atividade">
              <span>{this.state.atividade.descricao}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div>
              <h5>Hórario de trabalho</h5>
            </div>
            <div className="padding-bottons-atividade">
              <ButtonAtividade
                button={this.changeStatus.bind(this)}
                list={this.state.horarioTrabalho}
                status={this.state.atividade.status}/>
            </div>
            <div>
              <HorarioTrabalho horarioTrabalho={this.state.horarioTrabalho} totalTrabalho={this.state.totalTrabalho}/>
            </div>
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
            Selecione o anexo: <input type="file" onChange={this.fileSelected} />
            <Line percent={this.state.progressUpload} strokeWidth="4" strokeColor="#19c556" />
              <table className="table">
                  <thead>
                  <tr>
                      <th scope="col">Nome Arquivo</th>
                      <th scope="col">Tamanho</th>
                      <th scope="col">Nome</th>
                      <th scope="col">Opções</th>
                  </tr>
                  </thead>
                  <tbody>
                  {listaAnexo()}
                  </tbody>
              </table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.downloadAnexo}>Baixar</Button>
            <Button color="primary" onClick={this.closeModal.bind(this, 'modal1')}>Fechar</Button>
            <button onClick={this.fileUpload} className="btn btn-success">Salvar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modal2} toggle={this.closeModal.bind(this, 'modal2')} className={this.props.className}>
          <ModalHeader toggle={this.closeModal.bind(this, 'modal2')}>Novo comentário</ModalHeader>
          <ModalBody>
            <Input type="textarea" onChange={this.setComentario.bind(this)} value={this.state.comentario} name="text" id="inputComentario" />
            <Button color="btn btn-success float-right mt-2" onClick={this.enviarComentario.bind(this)}>Adicionar</Button>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.modal3} toggle={this.closeModal.bind(this, 'modal3')} className={this.props.className}>
          <ModalHeader toggle={this.closeModal.bind(this, 'modal3')}>Deseja realmente finalizar atividade?</ModalHeader>
          <ModalBody>
            <Button color="btn btn-default mt-2" onClick={this.closeModal.bind(this, 'modal3')}>Cancelar</Button>
            <Button color="btn btn-primary float-right mt-2" onClick={this.finalizarAtividade.bind(this)}>Finalizar</Button>
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