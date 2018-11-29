import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from 'react-stars';
import moment from 'moment/moment';
import 'react-toastify/dist/ReactToastify.css';
import ListaAtividades from './listaAtividades';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import {URL,CEP} from '../../global';
import InputMask from 'react-input-mask';

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
      idAtividade:0,
      nome: "",
      descricao: "",
      complemento: "",
      complexidade: 0,
      data_entrega: "",
      cep: "",
      endereco: "",
      numero_endereco: "",
      cidade: "",
      uf: "",
      cliente:{}
    };
    this.toggle = this.toggle.bind(this);
    this.showModal = this.showModal.bind(this);
    this.atividade = this.atividade.bind(this);
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
      .then(resp => this.setState({...this.state,projeto: resp.data.response,atividades: resp.data.response.atividades}))
      .then(resp=> this.setState({...this.state,endereco:this.state.projeto.nome}))
      .then(resp=> this.setState({...this.state,cliente:this.state.projeto.cliente}))
  }

  closeModal(tabId) {
    this.setState(
      {
        [tabId]: false
      }
    );
  }

  showModal(modal) {
    if(modal === 'adicionar_atividade'){
      this.setState(
        {
          [modal]: true,
          idAtividade:'',
          nome: '',
          status: '',
          descricao: '',
          complemento: '',
          complexidade:  '',
          data_entrega: '',
          data_criacao: '',
          cep:'',
          endereco: '',
          numero_endereco:  '',
          cidade: '',
          uf: '',
        }
      );
    } else {
      this.setState(
        {
          ['editar_atividade']: true,
          idAtividade:modal.id,
          nome: modal.nome,
          status:modal.status,
          descricao: modal.descricao,
          complemento: modal.complemento,
          complexidade: modal.complexidade,
          data_entrega: moment.utc(modal.data_entrega).format('YYYY-MM-DD'),
          data_criacao:modal.dataCriacao,
          cep: modal.cep,
          endereco: modal.endereco,
          numero_endereco: modal.enderecoNumero,
          cidade: modal.cidade,
          uf: modal.uf,
        }
      );
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
    if (nomeInput =='cep' && !evento.target.value.endsWith('_')){
      axios.get(`${CEP}${evento.target.value}/json/`)
        .then(resp=> {this.state, this.setState({endereco:resp.data.logradouro,uf:resp.data.uf,cidade:resp.data.localidade})})
    }
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

  setNomeAtividade(event){
    this.setState({nome:event.target.value})
  }

  setDataEntregaAtividade(event){
    this.setState({data_entrega:event.target.value})
  }

  setComplexidadeAtividade(event){
    this.setState({complexidade:event})
  }

  setDescricaoAtividade(event){
    this.setState({descricao:event.target.value})
  }

  setEnderecoAtividade(event){
    this.setState({endereco:event.target.value})
  }

  setNumeroEnderecoAtividade(event){
    this.setState({numero_endereco:event.target.value})
  }

  setComplementoAtividade(event){
    console.log(event.target.value)
    this.setState({complemento:event.target.value})
  }

  setCepAtividade(event){
    this.setState({cep:event.target.value})
    if(!event.target.value.endsWith('_')){
      axios.get(`${CEP}${event.target.value}/json/`)
        .then(resp=> {this.state, this.setState({endereco:resp.data.logradouro,uf:resp.data.uf,cidade:resp.data.localidade})})
    }
    
    
  }

  setCidadeAtividade(event){
    this.setState({cidade:event.target.value})
  }

  setUfAtividade(event){
    this.setState({uf:event.target.value})
  }

  setStatusAtividae(event){
    this.setState({status:event.target.value})
  }

  editarAtividade(){
    const json = {
      id:this.state.idAtividade,
      nome: this.state.nome,
      dataEntrega: this.state.data_entrega,
      status:this.state.status,
      dataCriacao:this.state.data_criacao,
      complexidade: this.state.complexidade,
      descricao: this.state.descricao,
      endereco: this.state.endereco,
      enderecoNumero: this.state.numero_endereco,
      complemento: this.state.complemento,
      cidade: this.state.cidade,
      cep: this.state.cep,
      uf: this.state.uf
    }
    var config = {
      headers: {
        Authorization: this.token
      }
    };
    axios.post(`${URL}atividade/gestor/editarAtividade`, json, config)
      .then(resp => toast.success(
        'Atividade editada com sucesso!',
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      )
      .then(this.closeModal.bind(this, 'adicionar_atividade'))
      .catch(resp => toast.error(
        'Falha ao editar Atividade!',
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      )
      .then(resp => this.refresh())
      .then(resp=> this.closeModal('editar_atividade'))
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
          <h3 className="d-inline-block">({this.state.projeto.numeroProjeto}){this.state.projeto.nome}</h3>
          <button className="btn btn-success float-right btn-round" onClick={this.showModal.bind(this, 'adicionar_atividade')}><i className="fas fa-plus fa-1x"></i> Adicionar nova atividade</button>
          <div className="clearfix"/>
          <div style={{'width':'100%'}}>
          {this.state.projeto.status !== undefined ? <p style={{'margin':'0'}} ><strong> Status:</strong> <em className="pjDetalhe"> {this.state.projeto.status}</em></p>:''}
          {this.state.projeto.fim !== null ? <p style={{'margin':'0'}} ><strong> Entrega:</strong> <em className="pjDetalhe"> {moment.utc(this.state.projeto.fim).format('DD/MM/YYYY')}</em></p>:''}
          {this.state.cliente.nome!== undefined? <p style={{'margin':'0'}}><strong> Cliente:</strong> <em className="pjDetalhe"> {this.state.cliente.nome}</em></p>:''}
          {this.state.projeto.descricao !== ''? <p style={{'overflow':'hidden','word-wrap': 'break-word'}}><strong>Descrição:</strong> <i className="pjDetalhe">{this.state.projeto.descricao}</i></p> :''}
          
          </div>
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
                    <Input  requtype="text" className="form-control" id="inputNomeAtividade" value={this.state.nome} onChange={this.dadosAtividade.bind(this,'nome')} placeholder="Nome da atividade"/>
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
                    <Input type="text" value={this.state.cep} onChange={this.dadosAtividade.bind(this,'cep')} className="form-control" id="inputCEP" placeholder="00000-000" mask="99999-999" tag={InputMask}/>
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
              <button onClick={this.cadastrarAtividade.bind(this)} className="btn btn-success float-right mt-2 btn-round">Cadastrar</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.editar_atividade} toggle={this.closeModal.bind(this, 'editar_atividade')} className="modal-dialog modal-lg">
            <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'editar_atividade')}>Editar Atividade</ModalHeader>
            <ModalBody className="card-header">
              <form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputNomeAtividade">Nome da atividade:</label>
                    <Input type="text" className="form-control" id="inputNomeAtividade" value={this.state.nome} onChange={this.setNomeAtividade.bind(this)}/>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputDate">Data de entrega:</label>
                    <Input type="date" onChange={this.setDataEntregaAtividade.bind(this)} id="inputDate" value={this.state.data_entrega}/>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputStatus" className="required">Status da Atividade</label>
                    <select id="inputStatus" value={this.state.status} onChange={this.setStatusAtividae.bind(this)}className="form-control">
                      <option selected> {this.state.status} </option>
                      {(this.state.status !== 'iniciada'? <option>iniciada</option> : '')}
                      {(this.state.status !== 'pendente'? <option>pendente</option> : '')}
                      {(this.state.status !== 'pausada'? <option>pausada</option> : '')}
                      {(this.state.status !== 'finalizada'? <option>finalizada</option> : '')}
                      {(this.state.status !== 'cancelada'? <option>cancelada</option> : '')}
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Dificuldade:&nbsp;</label>
                    <ReactStars
                      count={5}
                      value={this.state.complexidade}
                      onChange={this.setComplexidadeAtividade.bind(this)}
                      size={16}
                      color2={'#ffd700'} />
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="inputDescricaoAtividade">Descrição:</label>
                    <Input type="textarea" className="form-control" name="text" onChange={this.setDescricaoAtividade.bind(this)} id="inputDescricaoAtividade" value={this.state.descricao}/>
                  </div>
                  <div className="form-group col-md-8">
                    <label htmlFor="inputEndereco">Endereço:</label>
                    <Input type="text" className="form-control" id="inputEndereco" onChange={this.setEnderecoAtividade.bind(this)} value={this.state.endereco}/>
                  </div>
                   <div className="form-group col-md-4">
                    <label htmlFor="inputEnderecoNumero">Nº:</label>
                    <Input type="text" className="form-control" id="inputEnderecoNumero" onChange={this.setNumeroEnderecoAtividade.bind(this)} value={this.state.numero_endereco}/>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputComplemento">Complemento:</label>
                    <Input type="text" className="form-control" id="inputComplemento" onChange={this.setComplementoAtividade.bind(this)} value={this.state.complemento}/>
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputCidade">Cidade:</label>
                    <Input type="text" className="form-control" id="inputCidade" onChange={this.setCidadeAtividade.bind(this)} value={this.state.cidade}/>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="inputCEP">CEP:</label>
                    <Input type="text" className="form-control" id="inputCEP" onChange={this.setCepAtividade.bind(this)} value={this.state.cep} mask="99999-999" tag={InputMask}/>
                  </div>
                  <div className="form-group col-md-1">
                    <label htmlFor="inputEstado"className="required">UF:</label>
                    <select id="inputEstado" onChange={this.setUfAtividade.bind(this)} className="form-control">
                      <option selected>{this.state.uf}</option>
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
              <button onClick={this.editarAtividade.bind(this)} className="btn btn-success float-right mt-2">Salvar</button>
            </ModalFooter>
          </Modal>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={1000}
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
