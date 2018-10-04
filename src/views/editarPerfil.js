import React, { Component } from 'react';
import {Helmet} from 'react-helmet';
import { Input } from 'reactstrap';
import axios from 'axios'
import Select, {Option, OptGroup} from 'rc-select';
import {Redirect,Link} from 'react-router-dom';


const URL = `http://localhost:8080/`

export default class EditarPerfil extends Component {
  constructor(){
    super();

    let usuario = JSON.parse(localStorage.getItem('user'));
    console.log(usuario);
    this.state = {
      nome:usuario.nome,
      sobreNome: usuario.sobreNome,
      telefone:usuario.telefone,
      celular:usuario.celular,
      cep:usuario.cep,
      endereco:usuario.endereco,
      enderecoNumero:usuario.enderecoNumero,
      complemento:usuario.complemento,
      email: usuario.email,
      cidade:usuario.cidade,
      uf:usuario.uf,
    }

  	this.editar= this.editar.bind(this);


  }

    dadosUsuario(nomeInput,evento){
    var campoSendoAlterado = {}
    campoSendoAlterado[nomeInput] = evento.target.value
    this.setState(campoSendoAlterado)
  }
  	editar(){
	  	
	    var config = {headers:{Authorization:this.token}};
	    axios.post(`${URL}usuario/analista/editar_perfil`,this.state,config).then(resp=>console.log(resp.data))
	}

  render(){

    return(
      <div>
        	<br/>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/dashboardAdmin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Editar Perfil</li>
                  </ol>
                  <h3>Editar Perfil</h3>
                  <hr/>
                  <div className="container cadastrarAnalista table-wrapper-scroll-y">
                    <form>
                      <div className="form-row">

                        <div className="form-group col-md-6">
                          <label htmlFor="inputNome" className="required">Nome:</label>
                          <Input type="text" value={this.state.nome} onChange={this.dadosUsuario.bind(this, "nome")} className="form-control" id="inputNome" placeholder="Nome"/>
                        </div>

                        <div className="form-group col-md-6">
                          <label htmlFor="inputSobrenome" className="required">Sobrenome:</label>
                          <Input type="text" value={this.state.sobreNome} onChange={this.dadosUsuario.bind(this, "sobreNome")} className="form-control" id="inputSobrenome" placeholder="Sobrenome"/>
                        </div>
                      </div>
                    <div className="form-row">

                      <div className="form-group col-md-8">
                          <label htmlFor="inputEmail" >Email:</label>
                          <Input type="text" className="form-control required" value={this.state.email} onChange={this.dadosUsuario.bind(this, "email")} id="inputEmail" placeholder="Email"/>
                        </div>

                        <div className="form-group col-md-2">
                          <label htmlFor="inputTelefone">Telefone:</label>
                          <Input type="text" className="form-control" value={this.state.telefone} onChange={this.dadosUsuario.bind(this, "telefone")} id="telefone" placeholder="(11)xxxx-xxxx"/>
                        </div>

                        <div className="form-group col-md-2">
                          <label htmlFor="inputCelular" className="required">Celular:</label>
                          <Input type="text" className="form-control" value={this.state.celular} onChange={this.dadosUsuario.bind(this, "celular")} id="celular" placeholder="(11)9xxxx-xxxx"/>
                        </div>
                    </div>


                      <div className="form-row">

                        <div className="form-group col-md-6">
                          <label htmlFor="inputEndereco">Endereço:</label>
                          <Input type="text" className="form-control" value={this.state.endereco} onChange={this.dadosUsuario.bind(this, "endereco")} id="inputEndereco" placeholder="Rua/Av.:"/>
                        </div>

                        <div className="form-group col-md-2">
                          <label htmlFor="inputNumeroEndereco">Número:</label>
                          <Input type="text" className="form-control" value={this.state.enderecoNumero} onChange={this.dadosUsuario.bind(this, "enderecoNumero")} id="inputNumeroEndereco" placeholder="123"/>
                        </div>

                        <div className="form-group col-md-2">
                          <label htmlFor="inputComplemento">Complemento:</label>
                          <Input type="text" className="form-control" value={this.state.complemento} onChange={this.dadosUsuario.bind(this, "complemento")} id="inputComplemento" placeholder="Apto, Casa 2 ..."/>
                        </div>

                        <div className="form-group col-md-2">
                          <label htmlFor="inputCep" >CEP:</label>
                          <Input type="text" className="form-control" value={this.state.cep} onChange={this.dadosUsuario.bind(this, "cep")} id="inputCep" placeholder="00000-000"/>
                        </div>
                      </div>

                      <div className="form-row">

                        <div className="form-group col-md-8">
                          <label htmlFor="inputCidade">Cidade:</label>
                          <Input type="text" value={this.state.cidade} onChange={this.dadosUsuario.bind(this, "cidade")} className="form-control" id="inputCidade" placeholder="Cidade"/>
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="inputEstado"className="required">UF:</label>
                          <select id="inputEstado" value={this.state.uf} onChange={this.dadosUsuario.bind(this, "uf")} className="form-control">
                            <option selected>Selecione o estado</option>
                            <option>AC</option>
                            <option>AL</option>
                            <option>AP</option>
                            <option>AM</option>
                            <option>BA</option>
                            <option>CE</option>
                            <option>DF</option>
                            <option>ES</option>
                            <option>GO</option>
                            <option>MA</option>
                            <option>MT</option>
                            <option>MS</option>
                            <option>MG</option>
                            <option>PA</option>
                            <option>PB</option>
                            <option>PR</option>
                            <option>PE</option>
                            <option>PI</option>
                            <option>RJ</option>
                            <option>RN</option>
                            <option>RS</option>
                            <option>RO</option>
                            <option>RR</option>
                            <option>SC</option>
                            <option>SP</option>
                            <option>SE</option>
                            <option>TO</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">                        
                        <div className="col-md-2 botaoCadastratAnalista">
                          <button type="button" onClick={this.editar} className="btn btn-success float-right mb-3">Cadastrar <i className="fas fa-sm fa-plus"></i></button>
                        </div>
                      </div>                      
                    </form>
                  </div>
      </div>

    );
  }
}
