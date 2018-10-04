import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';


export default class DetalheAnalista extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
    this.toggle = this.toggle.bind(this);
    if(usuario == null){
      this.usuario = null
    }

    else{
      this.usuario = user.perfilAcesso
    }
    
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    });
  }

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
                        <div>
                          <table className="table table-bordered table-style table-display mt-3">
                            <tr>
                              <th colSpan="2"><a><span className="glyphicon glyphicon-chevron-left"></span></a></th>
                              <th colSpan="3"> Jan - 2018 </th>
                              <th colSpan="2"><a> > <span className="glyphicon glyphicon-chevron-right"></span></a></th>
                            </tr>
                            <tr>
                              <th>S</th>
                              <th>M</th>
                              <th>T</th>
                              <th>W</th>
                              <th>T</th>
                              <th>F</th>
                              <th>S</th>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>2</td>
                              <td>3</td>
                              <td>4</td>
                              <td>5</td>
                              <td>6</td>
                              <td>7</td>
                            </tr>
                            <tr>
                              <td>8</td>
                              <td>9</td>
                              <td>10</td>
                              <td>11</td>
                              <td className="today">12</td>
                              <td>13</td>
                              <td>14</td>
                            </tr>
                            <tr>
                              <td>15</td>
                              <td>16</td>
                              <td>17</td>
                              <td>18</td>
                              <td>19</td>
                              <td>20</td>
                              <td>21</td>
                            </tr>
                            <tr>
                              <td>22</td>
                              <td>23</td>
                              <td>24</td>
                              <td>25</td>
                              <td>26</td>
                              <td>27</td>
                              <td>28</td>
                            </tr>
                            <tr>
                              <td>29</td>
                              <td>30</td>
                              <td>31</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          </table>
                        </div>
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
