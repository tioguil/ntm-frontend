import React, { Component } from 'react';
import axios from 'axios';
import {URL} from '../global';
import $ from 'jquery';
import '../css/login.css';

export default class Login extends Component {
  constructor(){
    super();

    this.state = {
      email: "",
      senha: "",
      usuario: [],
      acesso_invalido: false
    }

    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  componentDidMount(){
    $('#root').addClass('container');
  }

  esqueceuSenha(){
    this.props.history.push("/esqueceuSenha");
  }

  setEmail(event){
      this.setState({email:event.target.value});
  }

  setSenha(event){
      this.setState({senha:event.target.value});
  }

  btn_login(event){
    event.preventDefault();
    axios.post(`${URL}login`, 
      {
        email: this.state.email, 
        senha: this.state.senha
      }
    )
      .then(resp => this.setState(
          {
            ...this.state, 
            usuario: resp.data
          }
        )
      )
      .then(resp => this.verify_user())
      .catch(err => (this.setState({acesso_invalido: true})))
  }

  verify_user(){
      localStorage.setItem("user", JSON.stringify(this.state.usuario));
      let perfilAcesso = this.state.usuario.perfilAcesso;
      console.log(perfilAcesso)
      if (perfilAcesso === "gestor"){
        window.tipo_usuario = 1;
        this.props.history.push("/DashboardAdmin");
      }
      if (perfilAcesso === "analista"){
        window.tipo_usuario = 0;
        this.props.history.push("/Dashboard");

      }
      if (perfilAcesso === "adm"){
        this.props.history.push("/");
      }
  }

  render(){
     const errorMessage = (
      this.state.acesso_invalido?
        <div className="alert alert-danger" role="alert">
          Usuário e/ou senhas inválidos!
        </div>
      : null
    );

    return(
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card card-signin my-5">
            <div className="card-body">
              <div className="card-title text-center contact-image">
                <img src="img/logo.png" alt="Logo"/>
              </div>
              {errorMessage}
              <h6 className="mb-3">Acessar o sistema NTM</h6>
              <form className="form-signin">
                <div className="form-label-group">
                  <input type="email" id="inputEmail" className="form-control" value={this.state.email} onChange={this.setEmail} placeholder="Usuário" required autofocus/>
                  <label for="inputEmail">Usuário</label>
                </div>

                <div className="form-label-group">
                  <input type="password" id="inputPassword" value={this.state.senha} onChange={this.setSenha} className="form-control" placeholder="Senha" required/>
                  <label for="inputPassword">Senha</label>
                </div>

                <button className="btn btn-lg btn-danger btn-red btn-block text-uppercase" onClick={this.btn_login.bind(this)} type="submit">Acessar</button>
                <div className="text-center mt-2">
                  <a className="small link-login" onClick={this.esqueceuSenha.bind(this)}>Esqueceu a sua senha?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
