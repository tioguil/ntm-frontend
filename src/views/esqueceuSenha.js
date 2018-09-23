import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import axios from 'axios'


const URL = `http://localhost:8080/`

export default class EsqueceuSenha extends Component {
    
  constructor(){
    super();
    this.state = {email:""}
    this.setEmail = this.setEmail.bind(this)
  }

  login(){
    this.props.history.push("/");
  }

  setEmail(event){
      this.setState({email:event.target.value});
  }

  recuperar_senha(){
    axios.post(`${URL}usuario/recuperacao`,{email:this.state.email}).then(resp => console.log(resp.data))
    this.props.history.push("/");
  }

  render(){
    return(
      <div>
          <Helmet>
            <style>{'body {background-color:#343a40;'}</style>
          </Helmet> 
        <div className="container">
          <div className="card card-login mx-auto mt-5">
            <div className="card-header">Nova senha</div>
            <div className="card-body">
              <div className="text-center mb-4">
                <h4>Esqueceu sua senha?</h4>
                <p>Digite o seu e-mail e enviaremos as informações para cadastrar a sua nova senha.</p>
              </div>
              <form>
                <div className="form-group">
                  <div className="form-label-group">
                    <input type="email" id="inputEmail" value={this.state.email} onChange={this.setEmail} className="form-control" placeholder="Digite o seu e-mail" required="required" autofocus="autofocus"/>
                    <label for="inputEmail">Digite o seu e-mail</label>
                  </div>
                </div>
                <a className="btn btn-primary btn-block" onClick={this.recuperar_senha.bind(this)}>Recuperar senha</a>
              </form>
              <div className="text-center mt-2">
                <a className="d-block small" onClick={this.login.bind(this)}>Acessar sua conta</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
