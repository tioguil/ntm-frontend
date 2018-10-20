import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import axios from 'axios'
import Calendar from 'react-calendar';
import {URL} from '../../global'

export default class DetalheAnalista extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.token = user.token.numero;
    this.state = {data:new Date(),usuario:""}
    this.toggle = this.toggle.bind(this);
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
    console.log(idAnalista)
    axios.get(`${URL}usuario/analista/buscar_usuario_by_id/${idAnalista}`,config)
      .then(resp=> this.setState({usuario:resp.data.response}))
      .then(resp=>console.log(this.state.usuario))
    
  }


  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = data => this.setState({data})

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
                <a className="email-detalhe-atividade" href="mailto:rodrigo11_santos@hotmail.com"><em><i className="far fa-envelope fa-1x fa-email"></i> {this.state.usuario.email}</em></a>
                <p className="telefones-contato"> <i className="fas fa-mobile-alt"></i> <em className="email-detalhe-atividade" > {this.state.usuario.celular} </em>
                <i class="fas fa-phone"></i> <em className="email-detalhe-atividade" > {this.state.usuario.telefone} </em></p>
                <i className="fa fa-location-arrow" aria-hidden="true"></i> {this.state.usuario.endereco}, {this.state.usuario.enderecoNumero} - {this.state.usuario.cidade}, {this.state.usuario.uf} - CEP: {this.state.usuario.cep}
              </div>
              <Calendar
                  className="calendar-properties"
                  onChange={this.onChange}
                  value={this.state.data}
                  selectRange={true}
                  hu-HU="pt-BR"
                />
            </div>
            <div className="col-md-5 row-detalhe-analista">
              <div className="card text-center card-detalhe-analista">
                <div className="card-body">
                  <h5 className="card-title">Atividade A</h5>
                  <p className="card-text">Breve descrição da atividade...</p>
                  <button className="btn btn-primary" onClick={this.atividade.bind(this)}>Visualizar</button>
                </div>
              </div>
              <div className="card text-center card-detalhe-analista">
                <div className="card-body">
                  <h5 className="card-title">Atividade B</h5>
                  <p className="card-text">Breve descrição da atividade...</p>
                  <button className="btn btn-primary" onClick={this.atividade.bind(this)}>Visualizar</button>
                </div>
              </div>
              <div className="card text-center card-detalhe-analista">
                <div className="card-body">
                  <h5 className="card-title">Atividade C</h5>
                  <p className="card-text">Breve descrição da atividade...</p>
                  <button className="btn btn-primary" onClick={this.atividade.bind(this)}>Visualizar</button>
                </div>
              </div>
              <div className="card text-center card-detalhe-analista">
                <div className="card-body">
                  <h5 className="card-title">Atividade D</h5>
                  <p className="card-text">Breve descrição da atividade...</p>
                  <button className="btn btn-primary" onClick={this.atividade.bind(this)}>Visualizar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
