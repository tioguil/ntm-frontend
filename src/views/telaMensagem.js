import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import { Link } from 'react-router-dom'


export default class TelaMensagem extends Component {
  constructor(){
    super();
  }

  render(){
    return(
      <div className="container">
        <Helmet>
          <style>{"html, body {height: 100% !important; } body {background-color: #f0f2f4; display: flex !important; align-items: center !important; } #root {width: 100%;}"}</style>
          <style>{".card-signin {border: 0; border-radius: 1rem; box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1); } .card-signin .card-title {margin-bottom: 2rem; font-weight: 300; font-size: 1.5rem; } .card-signin .card-body {padding: 2rem; } .form-signin {width: 100%; } .form-signin .btn {font-size: 80%; border-radius: 5rem; letter-spacing: .1rem; font-weight: bold; padding: 1rem; transition: all 0.2s; } .form-label-group {position: relative; margin-bottom: 1rem; } .form-label-group input {border-radius: 2rem; } .form-label-group > input, .form-label-group > label {padding: .75rem 1.5rem; } .form-label-group > label {position: absolute; top: 0; left: 0; display: block; width: 100%; margin-bottom: 0; line-height: 1.5; color: #495057; border: 1px solid transparent; border-radius: .25rem; transition: all .1s ease-in-out; } .form-label-group input::-webkit-input-placeholder {color: transparent; } .form-label-group input:-ms-input-placeholder {color: transparent; } .form-label-group input::-ms-input-placeholder {color: transparent; } .form-label-group input::-moz-placeholder {color: transparent; } .form-label-group input::placeholder {color: transparent; } .form-label-group input:not(:placeholder-shown) {padding-top: calc(.75rem + .75rem * (2 / 3)); padding-bottom: calc(.75rem / 3); } .form-label-group input:not(:placeholder-shown)~label {padding-top: calc(.75rem / 3); padding-bottom: calc(.75rem / 3); font-size: 12px; color: #777; }"}</style>
        </Helmet>
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-9 mx-auto">
            <div className="card card-signin my-5" >
              <div className="card-body">
                <div className="card-title text-center contact-image">
                  <img src="img/logo.png" alt="Logo"/>
                </div>
              <div className="text-center" style={{'marginBottom':'10px'}}>
                <h2>Cadastro efetuado com sucesso!</h2>
                <i></i>
              </div>

                <form className="form-signin">

                  <div className="text-center mt-2">
                       <Link to="/">Clique aqui para acessar o sistema</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
