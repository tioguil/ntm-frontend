import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import axios from 'axios'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter } from 'reactstrap';
import $ from 'jquery';
import {URL} from '../../global'

export default class ListarProjetos extends Component {
    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.usuario = user
        this.token = user.token.numero
        this.search = this.search.bind(this)
        this.toggle = this.toggle.bind(this);
        this.state= {projetos:[],chave:"",modal: false}
        if(usuario == null){
            this.usuario = null
        }else{
            this.usuario = user.perfilAcesso
        }
    }


    search(event){
        this.setState({chave:event.target.value})
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}usuario/gestor/pesquisar/${this.state.chave}`,config)
            .then(resp=> this.setState({}))
    }

    componentDidMount(){
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}projeto/gestor/listar/`,config)
            .then(resp=> this.setState({projetos:resp.data.response}))
    }

    projeto_detalhe(id){
        sessionStorage.setItem('idProjeto', id);
        this.props.history.push('/detalheProjeto')

    }

    editar_projeto(){
        console.log("enviar para o backend")
    }

    showModal(modal) {
        this.setState({
          [modal]: true
        });
    }

    toggle() {
        this.setState(
          {
            modal: !this.state.modal
          }
        );
    }

    closeModal(tabId) {
        this.setState(
            {
            [tabId]: false
            }
        );
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
                    <li className="breadcrumb-item active">Listar Projetos</li>
                </ol>

                <div className="form-group col-md-8">
                    <h3>Listar Projetos</h3>
                    <Input type="text" onChange={this.search} value={this.state.chave} className="form-control" id="inputProjetoListar" placeholder="Pesquisar por id, status, cidade.."/>
                </div>
                
                <hr/>
                <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                    <thead>
                    <tr>
                        <th className="th-sm">Nº Projetos<i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Projetos <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Status <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
                        <th className="th-sm">Região <i className="fa fa-sort float-right" aria-hidden="true"></i></th>
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
                                    <td>São Paulo <i className="far fa-edit" style={{'float':'right'}} onClick={this.showModal.bind(this,'editar_projeto')}>
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
                            
                          </form>
                        </ModalBody>
                        <ModalFooter className="card-header" >
                          <button onClick={this.editar_projeto.bind(this)} className="btn btn-success float-right mt-2 btn-round">Atualizar</button>
                        </ModalFooter>
                    </Modal>
            </div>
        );
    }
}
