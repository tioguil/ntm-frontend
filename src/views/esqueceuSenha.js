import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import axios from 'axios'
import {URL} from '../global'

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
            <style>{'body {background-color:#f0f2f4;'}</style>
          </Helmet> 
        <div className="container">
        	<div className="card-center">
	          <div className="card card-login mx-auto">
                <div className="contact-image"><img src="img/logo.png" alt="Logo"/></div>
	            <div className="card-body">
	              <div className="text-center mb-4">
	                <h4>Esqueceu sua senha?</h4>
	                <p className="login_info">Digite o seu e-mail e enviaremos as informações para cadastrar a sua nova senha.</p>
	              </div>
	              <form>
	                <div className="form-group">
	                  <div className="form-label-group">
	                    <input type="email" id="inputEmail" value={this.state.email} onChange={this.setEmail} className="form-control" placeholder="Digite o seu e-mail" required="required" autofocus="autofocus"/>
	                    <label for="inputEmail">Digite o seu e-mail</label>
	                  </div>
	                </div>
	                <button className="btn btn-primary btn-block btn-red mb5" onClick={this.recuperar_senha.bind(this)}>Recuperar senha</button>
	              </form>
	              <div className="text-center mt-2">
	                <a className="d-block small link-login" onClick={this.login.bind(this)}>Acessar sua conta</a>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
      </div>
    );
  }
}