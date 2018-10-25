import React, { Component } from 'react';
import axios from 'axios';
import {URL} from '../global';
import $ from 'jquery';
import '../css/login.css';

export default class EsqueceuSenha extends Component {
  constructor(){
    super();

    this.state = {email: ""}
    this.setEmail = this.setEmail.bind(this);
  }

  componentDidMount(){
    $('#root').addClass('container');
  }

  login(){
    this.props.history.push("/");
  }

  setEmail(event){
      this.setState({email:event.target.value});
  }

  recuperar_senha(){
    axios.post(`${URL}usuario/recuperacao`,{email:this.state.email})
      .then(resp => console.log(resp.data))
    this.props.history.push("/");
  }

  render(){
    return(
      <div class="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card card-signin my-5">
            <div className="card-body">
              <div className="card-title text-center contact-image">
                <img src="img/logo.png" alt="Logo"/>
              </div>
              <div className="text-center mb-3">
                <h4>Esqueceu sua senha?</h4>
                <h6>Digite o seu e-mail e enviaremos as informações para cadastrar a sua nova senha.</h6>
              </div>
              <form className="form-signin">
                <div className="form-label-group">
                  <input type="email" id="inputEmail" className="form-control" value={this.state.email} onChange={this.setEmail} placeholder="Digite o seu e-mail" required autofocus/>
                  <label for="inputEmail">Digite o seu e-mail</label>
                </div>
                <button className="btn btn-lg btn-danger btn-red btn-block text-uppercase" onClick={this.recuperar_senha.bind(this)} type="submit">Recuperar senha</button>
              </form>
              <div className="text-center mt-2">
                <a className="small link-login" onClick={this.login.bind(this)} href="#">Acessar sua conta</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}