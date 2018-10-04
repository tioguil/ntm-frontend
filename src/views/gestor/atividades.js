import React, { Component } from 'react';
import {Redirect,Link } from 'react-router-dom';
import Select, {Option, OptGroup} from 'rc-select';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from 'react-stars'
import axios from 'axios'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input } from 'reactstrap';


const URL = `http://localhost:8080/`

export default class Atividades extends Component {
  constructor(props){
    super(props);
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.token = user.token.numero
    this.state = {atividade:{},alocados:[],usuario:{id:0},analistas:[],value:''};
    this.adicionar = this.adicionar.bind(this)
    this.refresh = this.refresh.bind(this)
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
    var config = {headers:{Authorization:this.token}};
    axios.get(`${URL}atividade/analista/detalhe/${id}`,config)
      .then(resp=> this.setState(...this.state,{atividade:resp.data.response,alocados:resp.data.response.historicoAlocacao}))
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


  adicionar(){
    const json = {atividade:{id:this.state.atividade.id},usuario:this.state.usuario}
    console.log(json)
  
    var config = {headers:{Authorization:this.token}};
    axios.post(`${URL}historicoAlocacao/gestor/vincular`,json,config)
      .then(resp=> this.refresh())
      .then(resp=> toast.success('Usuario Vinculado sucesso!',{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            }))
      .catch(error=> toast.warn('Usuário já vinculado!',{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            }))
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
  const analistas = this.state.analistas;
    let options;
    options = analistas.map((a) => {
      return <Option key={a.id,a.nome}> <i>{a.nome}</i></Option>;
    });

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
                         <h3 className="inline-projeto">{this.state.atividade.nome}</h3> <i className="inline-projeto color-p-projeto"> - {this.state.atividade.dataEntrega} </i>  <i className="color-p-projeto">({this.state.atividade.status})</i>
                              <div>
                                <ReactStars
                                  count={5}
                                  value={this.state.atividade.complexidade}
                                  size={22}
                                  edit={false}
                                  color2={'#ffd700'} />
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
