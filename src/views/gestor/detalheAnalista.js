import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import axios from 'axios'
import Calendar from 'react-calendar';
import FiltroAtividade from './filtroAtividades'
import {URL} from '../../global'


export default class DetalheAnalista extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.token = user.token.numero;
    this.loadImage = this.loadImage.bind(this)
    this.state = {data:new Date(),
      usuario:"",
      atividades:[]}
    if(usuario == null){
      this.usuario = null
    }
    else{
      this.usuario = user.perfilAcesso
    }
    
  }

  componentDidMount(){
    var config = {headers:{Authorization:this.token}};
    const idAnalista = sessionStorage.getItem("idAnalista")
    axios.get(`${URL}usuario/analista/buscar_usuario_by_id/${idAnalista}`,config)
      .then(resp=> this.setState({usuario:resp.data.response}))    
      .then(response => this.loadImage(this.state.usuario)) 
  }

  loadImage(response){
    var config = {headers:{Authorization:this.token}};
    console.log(response.imagePath)
    if(response.imagePath!=null){
      axios.get(`${URL}usuario/analista/getimage/${response.imagePath}`,config)
        .then(resp=>this.setState({imagePath:resp.data.response}))
    }
    
  }

  filtroAtividade(){
    let inicio;
    let fim;
    var config = {headers:{Authorization:this.token}};
    if(this.state.data !== undefined){
      if (this.state.data.length > 1) {
        for(let i = 0; i<this.state.data.length ;i++){ 
          inicio=this.state.data[0].toISOString().split('T')[0]
          fim=this.state.data[1].toISOString().split('T')[0]

          axios.get(`${URL}atividade/gestor/listar/${inicio}/${fim}/${this.state.usuario.id}/`,config)
            .then(resp=> this.setState({atividades:resp.data.response}))
        }
      }
      else{
        inicio = this.state.data.toISOString().split('T')[0]
        fim = this.state.data.toISOString().split('T')[0]
        axios.get(`${URL}atividade/gestor/listar/${inicio}/${fim}/${this.state.usuario.id}/`,config)
          .then(resp=>this.setState({atividades:resp.data.response}))
      }
    }
  }

  onChange = data => this.setState({data})

  visualizarAtividade(id){
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
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboardAdmin">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/listarAnalistas">Listar Analistas</Link>
          </li>
          <li className="breadcrumb-item active">Analista</li>
        </ol>

        <div className="container-fluid mb-3">
          <div className="row">
            <div className="col-md-7">
              <div className="container text-center">
                <h3>{this.state.usuario.nome} {this.state.usuario.sobreNome} </h3>
                {(this.state.imagePath!=null? <img src={"data:image/jpeg;charset=utf-8;base64, " + this.state.imagePath}  className="analista-foto-detalhe" alt="photo-perfil"/>:'')}
                <a style={{'display':'block'}} className="email-detalhe-atividade" href="mailto:rodrigo11_santos@hotmail.com"><em><i className="far fa-envelope fa-1x fa-email"></i> {this.state.usuario.email}</em></a>
                <p className="telefones-contato"> <i className="fas fa-mobile-alt"></i> <em className="email-detalhe-atividade" > {this.state.usuario.celular} </em>
                <i className="fas fa-phone"></i> <em className="email-detalhe-atividade" > {this.state.usuario.telefone} </em></p>
                <i className="fa fa-location-arrow" aria-hidden="true"></i> {this.state.usuario.endereco}, {this.state.usuario.enderecoNumero} - {this.state.usuario.cidade}, {this.state.usuario.uf} - CEP: {this.state.usuario.cep}
              </div>
              <div className="calendar-properties">
                <Calendar
                    onChange={this.onChange}
                    value={this.state.data}
                    selectRange={true}
                    hu-HU="pt-BR"
                  />
                  <button type="button" onClick={this.filtroAtividade.bind(this)} className="btn btn-primary float-right button-properties">Filtrar</button>
              </div>
            </div>
              <div className="col-md-5 row-detalhe-analista">
                    <FiltroAtividade 
                    atividades={this.state.atividades}
                    visualizarAtividade = {this.visualizarAtividade.bind(this)}/>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
