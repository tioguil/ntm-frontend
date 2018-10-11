import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import Calendar from 'react-calendar';
import {URL} from '../../global'

export default class DetalheAnalista extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.state = {data:new Date()}
    this.toggle = this.toggle.bind(this);
    if(usuario == null){
      this.usuario = null
    }

    else{
      this.usuario = user.perfilAcesso
    }
    
  }

  componentDidMount(){
    const idAnalsta = sessionStorage.getItem("idAnalista")
    
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = data => this.setState(
    { data }
    )

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
              <br/>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/dashboardAdmin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/listarAnalistas">Listar Analistas</Link>
                    </li>
                    <li className="breadcrumb-item active">Analista</li>
                  </ol>

                  <div className="container CadastrarAnalista">
                    <div className="row">
                      <div className="col-md-7">
                        <div className="container text-center">
                          <h3> Rodrigo Santos </h3>
                          <a className="email-detalhe-atividade" href="mailto:rodrigo11_santos@hotmail.com"><em><i className="far fa-envelope fa-1x fa-email"></i> rodrigo11_santos@hotmail.com</em></a>
                          <br/>
                          <em><i className="fa fa-location-arrow" aria-hidden="true"></i> Rua/Av.:Avenida Vital Brasil, 300 - São Paulo - CEP: 05471-010</em>
                        </div>
                        <Calendar
                            className="calendar-properties"
                            onChange={this.onChange}
                            value={this.state.data}
                            hu-HU="pt-BR"
                          />
                      </div>
                      <div className="col-md-5 row-detalhe-analista table-wrapper-scroll-y">
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
