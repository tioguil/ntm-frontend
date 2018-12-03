import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import Select, { Option } from 'rc-select';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment/moment';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter } from 'reactstrap';
import {URL} from '../../global';

export default class ListarProjetos extends Component {
    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.usuario = user
        this.token = user.token.numero
        this.search = this.search.bind(this)
        this.toggle = this.toggle.bind(this);
        this.refresh();
        this.state= {clientes:[],cliente:{id:0} ,id:0,projetos:[],chave:"",modal:false, nome:'',descricao:'',status:'',numeroProjeto:'',inicio:'',fim:''}
        this.idCliente = 0
        if(usuario == null){
            this.usuario = null
        }else{
            this.usuario = user.perfilAcesso
        }
    }


    search(event){
        this.setState({chave:event.target.value})
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}projeto/gestor/listar/${this.state.chave}`,config)
            .then(resp=> this.setState({projetos:resp.data.response}))
    }





    refresh(){
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}projeto/gestor/listar/`,config)
            .then(resp=> this.setState({projetos:resp.data.response}))
    }

    projeto_detalhe(id){
        sessionStorage.setItem('idProjeto', id);
        this.props.history.push('/detalheProjeto')

    }

    editar_projeto(){
        const json = {
            cliente: {
                id: this.idCliente
              },
            id: this.state.id,
            numeroProjeto: this.state.numeroProjeto,
            nome: this.state.nome,
            descricao: this.state.descricao,
            estimativaEsforco: this.state.estimativaEsforco,
            inicio: this.state.inicio,
            fim: this.state.fim,
            status: this.state.status
        }
        var config = {
            headers:{
                Authorization:this.token
            }
        };
        axios.post(`${URL}projeto/gestor/editarProjeto` ,json, config)
        .then(resp => toast.success('Projeto atualizado com sucesso !', 
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        ).then(resp=> this.refresh())
        .catch(err => toast.error('Não foi possível atualizar o projeto, tente novamente.',
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        )
        this.closeModal()
    }

    showModal(projeto) {
        this.setState({
          ['editar_projeto']: true
        });
        this.setState({id:projeto.id,nome:projeto.nome,
            numeroProjeto:projeto.numeroProjeto,
            descricao:projeto.descricao,
            status:projeto.status,
            inicio:moment.utc(projeto.inicio).format('YYYY-MM-DD'),
            fim:moment.utc(projeto.fim).format('YYYY-MM-DD'),
            cliente:projeto.cliente.nome}) 
            this.idCliente = projeto.cliente.id  
    }

    toggle() {
        this.setState(
          {
            modal: !this.state.modal
          }
        );
    }

    closeModal() {
        this.setState(
            {
            ['editar_projeto']: false
            }
        );
    }

    onChange = (cliente) => {
      this.setState({cliente});
      if (cliente !== " ") {
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}cliente/gestor/listarclientes/${this.state.cliente}`, config)
          .then(resp => this.setState(...this.state, 
            {
              clientes: resp.data.response
            }
          ) 
        )
        }
    }

    onSelect = (v) => {
      for (let i=0; i<this.state.clientes.length; i++) {
        if (v === this.state.clientes[i].nome)
          this.idCliente = this.state.clientes[i].id; 
      }
    }

    editarNome(event){
        this.setState({nome:event.target.value})
    }

    editarNumero(event){
        this.setState({numeroProjeto:event.target.value})
    }

    editarStatus(event){
        this.setState({status:event.target.value})
    }
    editarDescricao(event){
        this.setState({descricao:event.target.value})
    }

    editarDataInicio(event){
        this.setState({inicio:event.target.value})
    }

    editarDataFim(event){
        this.setState({fim:event.target.value})
    }

    render(){
        if(this.usuario == null || this.usuario === "analista"){
            return (
                <Redirect to ="/"/>
            );
        }

        const clientes = this.state.clientes
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
                    <li className="breadcrumb-item active">Listar Projetos</li>
                </ol>

                <div className="form-group col-md-8">
                    <h3>Listar Projetos</h3>
                    <Input type="text" onChange={this.search} value={this.state.chave} className="form-control" id="inputProjetoListar" placeholder="Pesquisar pelo numero, nome, status ..."/>
                </div>
                
                <hr/>
                <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                    <thead>
                    <tr>
                        <th className="th-sm">Nº Projetos<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Projetos <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Status <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Opções <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                    </tr>
                    </thead>

                    <tbody className="curso-pointer">
                    {

                        this.state.projetos.map(function(projeto){
                            return(
                                <tr  key={projeto.id} >
                                    <td onClick={this.projeto_detalhe.bind(this,projeto.id)}>{projeto.numeroProjeto}</td>
                                    <td onClick={this.projeto_detalhe.bind(this,projeto.id)}>{projeto.nome}</td>
                                    <td onClick={this.projeto_detalhe.bind(this,projeto.id)}>{projeto.status}</td>
                                    <td style={{'textAlign':'center'}} ><i className="far fa-edit" onClick={this.showModal.bind(this,projeto)}>
                                        </i>
                                    </td>

                                </tr>
                            );
                        }.bind(this))
                    }
                    </tbody>
                </table>

                    <Modal isOpen={this.state.editar_projeto} toggle={this.closeModal.bind(this, 'editar_projeto')} className="modal-dialog modal-lg">
                        <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'editar_projeto')}>Editar Projeto</ModalHeader>
                        <ModalBody className="card-header">
                          <form>
                            <div className="form-row">
                              <div className="form-group col-md-8">
                                <label htmlFor="inputNomeProjeto">Nome do Projeto:</label>
                                <Input  requtype="text" className="form-control" id="inputNomeProjeto" value={this.state.nome} onChange={this.editarNome.bind(this)} placeholder="Nome do projeto"/>
                              </div>
                              <div className="form-group col-md-4">
                                <label htmlFor="inputNumeroProjeto">Número do Projeto:</label>
                                <Input  requtype="text" className="form-control" id="inputNumeroProjeto" value={this.state.numeroProjeto} onChange={this.editarNumero.bind(this)} placeholder="Número do projeto"/>
                              </div>

                              <div className="form-group col-md-6">
                                <label htmlFor="inputStatus" className="required">Status do Projeto</label>
                                <select id="inputStatus" value={this.state.status} onChange={this.editarStatus.bind(this)} className="form-control">
                                  <option selected> {this.state.status} </option>
                                  {(this.state.status !== 'iniciado'? <option>iniciado</option> : '')}
                                  {(this.state.status !== 'em andamento'? <option>em andamento</option> : '')}
                                  {(this.state.status !== 'finalizado'? <option>finalizado</option> : '')}
                                  {(this.state.status !== 'cancelado'? <option>cancelado</option> : '')}
                                </select>
                              </div>

                              <div className="form-group col-md-3">
                                <label htmlFor="inputDataInicio">Data de inicio:</label>
                                <Input type="date"  id="inputDataInicio" onChange={this.editarDataInicio.bind(this)} value={this.state.inicio} />
                              </div>
                              <div className="form-group col-md-3">
                                <label htmlFor="inputDataFim">Data de entrega:</label>
                                <Input type="date" onChange={this.editarDataFim.bind(this)} id="inputDataFim" value={this.state.fim}/>
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputCliente">Cliente</label>
                                <Select
                                      style={{width:'100%'}}
                                      onChange={this.onChange}
                                      onSelect={this.onSelect}
                                      notFoundContent="Não encontrado"
                                      allowClear
                                      placeholder="Pesquise por nome, cpf ou cnpj"
                                      value={this.state.cliente}
                                      combobox
                                      backfill
                                      filterOption={false}>
                                      {options}
                                    </Select>
                              </div>
                              <div className="form-group col-md-12">
                                <label htmlFor="inputDescricaoProjeto">Descrição:</label>
                                <Input type="textarea" value={this.state.descricao} onChange={this.editarDescricao.bind(this)} className="form-control" name="text" id="inputDescricaoProjeto" placeholder="Descrição"/>
                              </div>
                            </div>
                          </form>
                        </ModalBody>
                        <ModalFooter className="card-header" >
                          <button onClick={this.editar_projeto.bind(this)} className="btn btn-success float-right mt-2 btn-round">Atualizar</button>
                        </ModalFooter>
                    </Modal>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                      />
                    <ToastContainer/>
            </div>
        );
    }
}
