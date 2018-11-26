import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'rc-select/assets/index.css';
import Select, { Option } from 'rc-select';
import { Redirect,Link } from 'react-router-dom';
import axios from 'axios';
import 'react-day-picker/lib/style.css';
import {URL} from '../../global';


export default class CadastrarProjeto extends Component {
  constructor() {
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.token = user.token.numero;
    this.state = {
      clientes: [],
      value: "", 
      projeto: {
        numeroProjeto: "", 
        nome: "",
        descricao: "",
        estimativaEsforco: "",
        inicio: "",
        fim: "",
        cliente: {
          id: 1
        },
        usuarioId: 1
      }
    }

    this.formataDataInicio = this.formataDataInicio.bind(this);
    this.formataDataFim = this.formataDataFim.bind(this);
    this.cadastrarProjeto = this.cadastrarProjeto.bind(this);
    this.usuario = usuario == null ? null : user.perfilAcesso;
  }

  formataDataInicio(evento) {
   this.setState({inicio: evento.target.value});
  }

  formataDataFim(evento) {
   this.setState({fim: evento.target.value});
  }

  onChange = (value) => {
    this.setState({value});
    if (value !== " ") {
      var config = {headers:{Authorization:this.token}};
      axios.get(`${URL}cliente/gestor/listarclientes/${this.state.value}`, config)
        .then(resp => this.setState(
          ...this.state, 
          {
            clientes: resp.data.response
          }
        )
      );
    }
  }

  toggleDisabled = () => {
    this.setState(
      {
        disabled: !this.state.disabled
      }
    );
  }

  dadosProjeto(nomeInput, evento) {
    var campoSendoAlterado = {}
    campoSendoAlterado[nomeInput] = evento.target.value;
    this.setState(campoSendoAlterado);
  }

  onSelect = (v) => {
    for (let i=0; i<this.state.clientes.length; i++) {
      if (v === this.state.clientes[i].nome)
        this.setState({cliente:{id:this.state.clientes[i].id}});
    }
  }

  cadastrarProjeto(){
    const json = {
      cliente: {
        id: this.state.cliente.id
      },
      numeroProjeto: this.state.numeroProjeto, 
      nome: this.state.nome,
      descricao: this.state.descricao,
      estimativaEsforco: this.state.estimativaEsforco,
      inicio: this.state.inicio,
      fim: this.state.fim,
      status: "iniciado"
    }
    var config = {
      headers: {
        Authorization: this.token
      }
    };

    axios.post(`${URL}projeto/gestor/cadastrar`, json, config)
      .then(resp => toast.success('Projeto cadastrado com sucesso!', 
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      )
      .catch(err => toast.error('Não foi possível cadastrar o projeto, tente novamente.',
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      )
    this.setState(...this.state, 
      {
        numeroProjeto: "",
        nome: "",
        descricao: "",
        estimativaEsforco: "",
        inicio: "",
        fim: "",
        status: "iniciado",
        value: ""
      }
    );
  }

  render(){
    if (this.usuario == null || this.usuario === "analista") {
      return (
        <Redirect to ="/"/>
      );
    }

    const clientes = this.state.clientes;
    let options;
    options = clientes.map((c) => {
      return <Option key={c.id,c.nome}> <i>{c.nome}</i></Option>;
    });

    return (
      <div>
        <br/>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboardAdmin">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">
            Cadastrar Projeto
          </li>
        </ol>
        <h3>Cadastrar Projeto</h3>
        <hr/>
        <div className="container-fluid mb-3">
          <form>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputNomeProjeto" className="required">Nome do projeto:</label>
                <Input type="text" value={this.state.nome} onChange={this.dadosProjeto.bind(this,'nome')} className="form-control" id="inputNomeProjeto" placeholder="Ex.: Projeto A"/>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="inputNumeroProjeto" className="required">Número do projeto:</label>
                <Input type="text" value={this.state.numeroProjeto} onChange={this.dadosProjeto.bind(this,'numeroProjeto')} className="form-control" id="inputNumProjeto" placeholder="Ex.:1234"/>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="inputDataInicio" className="required">Data inicial:</label>
                <Input type="date" onChange={this.formataDataInicio.bind(this)} value={this.state.inicio} />
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="inputDataFim" className="required">Data final:</label>
                <Input type="date" onChange={this.formataDataFim.bind(this)} value={this.state.fim} />
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="inputEsforco" className="required">Estimativa de esforço:</label>
                <Input type="text" value={this.state.estimativaEsforco} onChange={this.dadosProjeto.bind(this,'estimativaEsforco')} className="form-control" id="inputEsforco" placeholder="Ex.:160horas"/>
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="inputCliente" className="required">Cliente:</label>
                <Select
                  style={{width:'100%'}}
                  onChange={this.onChange}
                  onSelect={this.onSelect}
                  notFoundContent="Não encontrado"
                  allowClear
                  placeholder="Pesquise por nome, cpf ou cnpj"
                  value={this.state.value}
                  combobox
                  backfill
                  filterOption={false}>
                  {options}
                </Select>
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="inputDescricao" className="required">Descrição:</label>
                <Input type="textarea" value={this.state.descricao} onChange={this.dadosProjeto.bind(this,'descricao')} rows="5" className="form-control" name="text" id="inputDescricao"/>
              </div>
            </div>
            <button type="button" onClick={this.cadastrarProjeto} className="btn btn-success float-right mb-3 btn-round">Cadastrar</button>
          </form>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
          {/* Same as */}
        <ToastContainer/>
      </div>
    );
  }
}
