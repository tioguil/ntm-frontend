import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from 'react-stars';
import 'react-toastify/dist/ReactToastify.css';
import ListaAtividades from './listaAtividades';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter } from 'reactstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from "react-day-picker/moment";
import moment from "moment";
import {URL} from '../../global'

export default class DetalheProjeto extends Component {
  constructor(props) {
    super(props);
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user;
    this.token = user.token.numero;
    this.projeto_id = 0;
    this.state = {
      modal: false,
      projeto: {},
      atividades: [],
      nome: "",
      descricao: "",
      complemento: "",
      complexidade: 0,
      data_entrega: "",
      cep: "",
      endereco: "",
      numero_endereco: "",
      cidade: "",
      uf: ""
    };
    this.toggle = this.toggle.bind(this);
    this.showModal = this.showModal.bind(this);
    this.atividade = this.atividade.bind(this);
    this.activity = {}
    this.usuario = usuario == null ? null : user.perfilAcesso;
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    var config = {headers:{Authorization:this.token}};
    const id = sessionStorage.getItem('idProjeto', id);
    this.projeto_id = id;
    axios.get(`${URL}projeto/gestor/buscaid/${id}`,config)
      .then(resp => this.setState(
        {
          ...this.state,
          projeto: resp.data.response,
          atividades: resp.data.response.atividades
        }
      )
    );
  }

  closeModal(tabId) {
    this.setState(
      {
        [tabId]: false
      }
    );
  }

  showModal(modal) {
    if(modal == 'adicionar_atividade'){
      this.setState(
        {
          [modal]: true
        }
      );
    } else {
      this.setState(
        {
          ['editar_atividade']: true
        }
      );
      this.activity = modal
    }
  }

  toggle() {
    this.setState(
      {
        modal: !this.state.modal
      }
    );
  }

  formataDataEntrega(evento) {
   this.setState({data_entrega:evento.target.value}) 
  }

  formataDataCriacao(evento) {
    this.setState({data_criacao:evento.target.value}) 
  }

  atividade(id) {
    sessionStorage.setItem('idAtividade', id);
    this.props.history.push("/atividades");
  }

  dadosAtividade(nomeInput, evento) {
    var campoSendoAlterado = {}
    campoSendoAlterado[nomeInput] = evento.target.value;
    this.setState(campoSendoAlterado);
  }

  cadastrarAtividade() {
    const json = {
      nome: this.state.nome,
      dataEntrega: this.state.data_entrega,
      dataCriacao:this.state.data_criacao,
      complexidade: this.state.complexidade,
      descricao: this.state.descricao,
      endereco: this.state.endereco,
      enderecoNumero: this.state.numero_endereco,
      complemento: this.state.complemento,
      cidade: this.state.cidade,
      cep: this.state.cep,
      uf: this.state.uf,
      projeto: {
        id: this.projeto_id
      }
    }

    var config = {
      headers: {
        Authorization: this.token
      }
    };

    axios.post(`${URL}atividade/gestor/cadastrar`, json, config)
      .then(resp => this.refresh())
      .then(resp => toast.success(
        'Cadastrado com sucesso!',
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      )
      .then(this.closeModal.bind(this, 'adicionar_atividade'))
      .catch(resp => toast.error(
        'Falha ao cadastrar Atividade!',
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      )
  }

  stars(evento) {
    this.setState(
      {
        complexidade: evento
      }
    );
  }

  

  render(){
    if (this.usuario == null || this.usuario === "analista") {
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
          <li className="breadcrumb-item active">
            Atividades
          </li>
        </ol>
        <div className="container mb-3">
          <h3 className="d-inline-block">{this.state.projeto.nome}</h3>
          <button className="btn btn-success float-right" onClick={this.showModal.bind(this, 'adicionar_atividade')}><i className="fas fa-plus fa-1x"></i> Adicionar nova atividade</button>
          <div className="clearfix"/>
          <hr/>
          <ListaAtividades 
            atividades={this.state.atividades}
            showModal={this.showModal}
            atividade={this.atividade}
          />

          <Modal isOpen={this.state.adicionar_atividade} toggle={this.closeModal.bind(this, 'adicionar_atividade')} className="modal-dialog modal-lg">
            <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'adicionar_atividade')}>Adicionar nova atividade</ModalHeader>
            <ModalBody className="card-header">
              <form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputNomeAtividade">Nome da atividade:</label>
                    <Input type="text" className="form-control" id="inputNomeAtividade" value={this.state.nome} onChange={this.dadosAtividade.bind(this,'nome')} placeholder="Nome da atividade"/>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputDate">Data de inicio:</label>
                    <Input type="date" onChange={this.formataDataCriacao.bind(this)} value={this.state.data_criacao} />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputDate">Data de entrega:</label>
                    <Input type="date" onChange={this.formataDataEntrega.bind(this)} value={this.state.data_entrega} />
                  </div>
                  <div className="form-group col-md-12 alinhamento-atividade">
                    <label>Dificuldade:&nbsp;</label>
                    <ReactStars
                      count={5}
                      value={this.state.complexidade}
                      onChange={this.stars.bind(this)}
                      size={16}
                      color2={'#ffd700'} />
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="inputDescricaoAtividade">Descrição:</label>
                    <Input type="textarea" value={this.state.descricao} onChange={this.dadosAtividade.bind(this,'descricao')} className="form-control" name="text" id="inputDescricaoAtividade" placeholder="Descrição"/>
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="inputEndereco">Endereço:</label>
                    <Input type="text" value={this.state.endereco} onChange={this.dadosAtividade.bind(this,'endereco')} className="form-control" id="inputEndereco" placeholder="Ex.:Rua/Av.."/>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEnderecoNumero">Nº:</label>
                    <Input type="text"  value={this.state.numero_endereco} onChange={this.dadosAtividade.bind(this,'numero_endereco')} className="form-control" id="inputEnderecoNumero" placeholder="EX.:123"/>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputComplemento">Complemento:</label>
                    <Input type="text" value={this.state.complemento} onChange={this.dadosAtividade.bind(this,'complemento')} className="form-control" id="inputComplemento" placeholder="Ex.:Casa/Apto"/>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputCidade">Cidade:</label>
                    <Input type="text" value={this.state.cidade}  onChange={this.dadosAtividade.bind(this,'cidade')} className="form-control" id="inputCidade" placeholder="Ex.:São Paulo"/>
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputCEP">CEP:</label>
                    <Input type="text" value={this.state.cep} onChange={this.dadosAtividade.bind(this,'cep')} className="form-control" id="inputCEP" placeholder="00000-000"/>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEstado" className="required">UF:</label>
                    <select id="inputEstado" value={this.state.uf} onChange={this.dadosAtividade.bind(this,'uf')} className="form-control">
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
              <button onClick={this.cadastrarAtividade.bind(this)} className="btn btn-success float-right mt-2">Cadastrar</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.editar_atividade} toggle={this.closeModal.bind(this, 'editar_atividade')} className="modal-dialog modal-lg">
            <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'editar_atividade')}>Editar Atividade</ModalHeader>
            <ModalBody className="card-header">
              <form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputNomeAtividade">Nome da atividade:</label>
                    <Input type="text" className="form-control" id="inputNomeAtividade" value={this.activity.nome} onChange=""/>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputDate">Data de entrega:</label>
                    <DayPickerInput format="DD/MM/YYYY" formatDate={formatDate} parseDate={parseDate} placeholder="DD/MM/YYYY" onDayChange={this.formataDataEntrega.bind(this)} value={this.activity.dataEntrega} inputProps={{className: 'form-control'}} />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Dificuldade:&nbsp;</label>
                    <ReactStars
                      count={5}
                      value={this.activity.complexidade}
                      onChange=""
                      size={16}
                      color2={'#ffd700'} />
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
        <ToastContainer/>
      </div>
    );
  }
}
