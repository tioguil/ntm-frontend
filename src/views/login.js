import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios'
import {URL} from '../global'


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
    axios.post(`${URL}login`,{email:this.state.email , senha:this.state.senha})
          .then(resp => this.setState({...this.state,usuario:resp.data}))

          .then(resp=>this.verify_user())
          .catch(err=>(this.setState({acesso_invalido: true})))

  }

  verify_user(){
      localStorage.setItem("user", JSON.stringify(this.state.usuario));
      let perfilAcesso = this.state.usuario.perfilAcesso
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
      <div>
          <Helmet>
            <style>{'body {background-color:#f0f2f4;'}</style>
          </Helmet>
        <div className="container ">
            <div className="card-center ">
                
                <div className="card card-login mx-auto contact-form">
        <div className="contact-image"><img src="img/logo.png" alt="Logo"/></div>
                    <div className="card-body">
                      {errorMessage}
                      <form>
                        <p className="login_info">Acessar o sistema NTM</p>
                        <div className="form-group">
                          <div className="form-label-group">
                            <input type="email" id="inputEmail" className="form-control" value={this.state.email} onChange={this.setEmail} placeholder="Email address" required="required" autofocus="autofocus"/>
                            <label for="inputEmail">Usuário</label>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="form-label-group">
                            <input type="password" id="inputPassword" value={this.state.senha} onChange={this.setSenha} className="form-control" placeholder="Password" required="required"/>
                            <label for="inputPassword">Senha</label>
                          </div>
                        </div>
                        <button className="btn btn-primary btn-block btn-red mb5" onClick={this.btn_login.bind(this)}>Acessar</button>
                      </form>
                    <div className="text-center mt-2">
                        <a className="d-block small link-login" onClick={this.esqueceuSenha.bind(this)}>Esqueceu a sua senha?</a>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>



    );
  }
}
