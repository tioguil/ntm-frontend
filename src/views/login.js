import React, { Component } from 'react';
import axios from 'axios';
import {URL} from '../global';
import {Helmet} from 'react-helmet';
import {toast, ToastContainer} from "react-toastify";

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
      var config = {
          headers: {
              Authorization: this.state.usuario.token.numero
          }
      };

      let perfilAcesso = this.state.usuario.perfilAcesso;
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
      <div className="container">
        <Helmet>
          <style>{"html, body {height: 100% !important; } body {background-color: #f0f2f4; display: flex !important; align-items: center !important; } #root {width: 100%;}"}</style>
          <style>{".card-signin {border: 0; border-radius: 1rem; box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1); } .card-signin .card-title {margin-bottom: 2rem; font-weight: 300; font-size: 1.5rem; } .card-signin .card-body {padding: 2rem; } .form-signin {width: 100%; } .form-signin .btn {font-size: 80%; border-radius: 5rem; letter-spacing: .1rem; font-weight: bold; padding: 1rem; transition: all 0.2s; } .form-label-group {position: relative; margin-bottom: 1rem; } .form-label-group input {border-radius: 2rem; } .form-label-group > input, .form-label-group > label {padding: .75rem 1.5rem; } .form-label-group > label {position: absolute; top: 0; left: 0; display: block; width: 100%; margin-bottom: 0; line-height: 1.5; color: #495057; border: 1px solid transparent; border-radius: .25rem; transition: all .1s ease-in-out; } .form-label-group input::-webkit-input-placeholder {color: transparent; } .form-label-group input:-ms-input-placeholder {color: transparent; } .form-label-group input::-ms-input-placeholder {color: transparent; } .form-label-group input::-moz-placeholder {color: transparent; } .form-label-group input::placeholder {color: transparent; } .form-label-group input:not(:placeholder-shown) {padding-top: calc(.75rem + .75rem * (2 / 3)); padding-bottom: calc(.75rem / 3); } .form-label-group input:not(:placeholder-shown)~label {padding-top: calc(.75rem / 3); padding-bottom: calc(.75rem / 3); font-size: 12px; color: #777; }"}</style>
        </Helmet>
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
        <ToastContainer />
      </div>
    );
  }
}
