import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Select, { Option, OptGroup } from 'rc-select';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from 'react-stars'
import axios from 'axios'
import {URL} from '../../global'
import ListaComentariosGestor from './listaComentariosGestor'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input } from 'reactstrap';


export default class Atividades extends Component {
  constructor(props){
    super(props);
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.token = user.token.numero
    this.atividadeId=0
    this.state = {
    atividade:{},
    comentario:"",
    alocados:[],
    usuario:{id:0},
    analistas:[],
    comentarios:[],
    value:''};
    this.adicionar = this.adicionar.bind(this)
    this.verificaAnalista = this.verificaAnalista.bind(this)
    this.refresh = this.refresh.bind(this)
    this.setComentarios =this.setComentarios.bind(this)
    if(usuario == null){
      this.usuario = null
    }
    else{
      this.usuario = user.perfilAcesso
    }
    
  }
  componentDidMount(){
    this.refresh()
  }

  refresh(){
    const id = sessionStorage.getItem('idAtividade', id);
    this.atividadeId = id
    var config = {headers:{Authorization:this.token}};
    axios.get(`${URL}atividade/analista/detalhe/${id}`,config)
      .then(resp=> this.setState(...this.state,{atividade:resp.data.response,alocados:resp.data.response.historicoAlocacao,comentarios:resp.data.response.comentarios}))
      
  }

  btn_detalheAnalista(id){
    this.props.history.push("/detalheAnalista");
  }


  onSelect = (v) => {
      for (let i=0; i<this.state.analistas.length; i++){
        if( v ==this.state.analistas[i].nome){
            this.setState({usuario:{id:this.state.analistas[i].id}})
        }
      }
  }

  verificaAnalista(dados){
    console.log(dados)
    if(dados.statusCode ==='200'){
      toast.success('Usuario Vinculado sucesso!',{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            })
      this.refresh()
    }
    else {
      toast.warn('Usuário já Vinculado',{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            })
      }
  }

  verificaConflito(data){
    if(data.statusCode=='401'){
      
      }
    
    else{
      const json = {atividade:{id:this.state.atividade.id},usuario:this.state.usuario}
      var config = {headers:{Authorization:this.token}};
    
    axios.post(`${URL}historicoAlocacao/gestor/vincular`,json,config)
      .then(resp => this.verificaAnalista(resp.data))
      .then(resp=> this.setState({value:""}))
      .catch(error=> toast.error('Erro no servidor!',{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            }))
    }
  }

  adicionar(){
    const json = {atividade:{id:this.state.atividade.id},usuario:this.state.usuario}
    var config = {headers:{Authorization:this.token}};
    axios.post(`${URL}historicoAlocacao/gestor/conflito`,json,config)
      .then(resp=> this.verificaConflito(resp.data))

    
    
  }

  enviarComentario(){
      var config = {headers:{Authorization:this.token}};
      const json = {comentario:this.state.comentario,atividade:{id:this.atividadeId}}
      axios.post(`${URL}comentario/analista/cadastrar`,json,config)
      .then(resp=> console.log(resp.data))
      .catch(error => console.log(error))
     
  }

  setComentarios(event){
      this.setState({comentario:event.target.value})
  }

  onChange = (value) => {
    this.setState({value,});
    if (value!=" ") {
      var config = {headers:{Authorization:this.token}};
      axios.get(`${URL}usuario/gestor/pesquisar/${this.state.value}`,config)
        .then(resp=> this.setState({analistas:resp.data.response}))
    }
  }

  mapsSelector() {
   const endereco=  this.state.atividade.endereco
   const numero = this.state.atividade.enderecoNumero
    if 
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
    const analistas = this.state.analistas;
    let options;
    options = analistas.map((a) => {
      return <Option key={a.id,a.nome}> <i>{a.nome}</i></Option>;
    });

    return (
      <div>
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

        <div className="container-fluid">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="home-tab" data-toggle="tab" href="#detail" role="tab" aria-controls="home" aria-selected="true">Detalhes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="members-tab" data-toggle="tab" href="#members" role="tab" aria-controls="profile" aria-selected="false">Analistas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="comentarios-tab" data-toggle="tab" href="#comentarios" role="tab" aria-controls="comentarios" aria-selected="false">Comentários</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="anexos-tab" data-toggle="tab" href="#anexos" role="tab" aria-controls="anexos" aria-selected="false">Anexos</a>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="detail" role="tabpanel" aria-labelledby="home-tab">
              <div className="atividade-projeto">
                <h3 className="inline-projeto">{this.state.atividade.nome}</h3> 
                <i className="inline-projeto color-p-projeto"> - {this.state.atividade.dataEntrega}</i> <i className="color-p-projeto">({this.state.atividade.status})</i>
                <div>
                  <ReactStars
                    count={5}
                    value={this.state.atividade.complexidade}
                    size={22}
                    edit={false}
                    color2={'#ffd700'} />
                </div>
                <p className="descript">{this.state.atividade.descricao}</p>
                <div className="location-margin">
                  <li className="list-inline-item">
                    <i className="fa fa-location-arrow" aria-hidden="true"></i> <a className="atividade-localizacao" onClick={this.mapsSelector.bind(this)}> {this.state.atividade.endereco}, {this.state.atividade.enderecoNumero}, {this.state.atividade.cidade}- 
                    {this.state.atividade.uf} - {this.state.atividade.cep} </a>
                  </li>
                </div>  
              </div>
            </div>
            <div className="tab-pane fade" id="comentarios" role="tabpanel" aria-labelledby="comentarios-tab">
              <div className="atividade-projeto">
                <ListaComentariosGestor comentarios={this.state.comentarios}/>
                <div className="text-comentario p-4 row m-auto">
                  <div className="col-10">
                    <Input type="textarea" onChange={this.setComentarios} value={this.state.comentario} name="text" id="inputComentario" />
                  </div>
                  <div className="col-2">
                    <Button className="btn btn-block btn-success" onClick={this.enviarComentario.bind(this)}>Adicionar</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-pane fade" id="anexos" role="tabpanel" aria-labelledby="anexos-tab">
              <div className="atividade-projeto">

              </div>
            </div>

        
            <div className="tab-pane fade" id="members" role="tabpanel" aria-labelledby="members-tab">
              <label className="label-buscar-analistas" htmlFor="inputNomeAtividade">Buscar Analista:</label>
                <Select
                  style={{width:'50%'}}
                  onChange={this.onChange}
                  onSelect={this.onSelect}
                  notFoundContent="Não encontrado"
                  allowClear
                  placeholder="Pesquise por nome, cpf ou cnpj"
                  value={this.state.value}
                  combobox
                  backfill
                  filterOption={true}>
                 {options} 
                </Select>
              <button type="button" onClick={this.adicionar} className="btn btn-primary btn-adicionar-analista">Adicionar</button>
              <div className="row members-margin">  
                {
                  this.state.alocados.map(function(analista){
                   return( 
                   <div   className="card col-md-3 no-margin c-analista" >
                       <div key={analista.id} className="card-body" onClick={this.btn_detalheAnalista.bind(this,analista.id)}>
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
              </div>
            </div>
          </div>
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
        <ToastContainer />
      </div>
    );
  }
}
