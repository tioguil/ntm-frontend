import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import ListaComentarios from './listaComentarios'
import {URL} from '../../global'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input } from 'reactstrap';

export default class VisualizarComentarios extends Component {
    constructor(){
        super();
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        const idAtividade = sessionStorage.getItem('idAtividadeAnalista')
        this.usuario = user
        this.token = user.token.numero
        this.state = {comentarios:[],comentario:'',idAtividade:idAtividade}
        this.refresh = this.refresh.bind(this)
        if(usuario == null){
            this.usuario = null
        }
        else{
            this.usuario = user.perfilAcesso
        }
        this.refresh()
    }


    refresh(){
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}comentario/analista/lista/${this.state.idAtividade}`,config)
            .then(resp=> this.setState({...this.state,comentarios:resp.data.response}))
    }

    setComentario(event){
        console.log(event.target.value)
        this.setState({comentario:event.target.value})
    }

    enviarComentario(){
        var config = {headers:{Authorization:this.token}};
        const json = {comentario:this.state.comentario,atividade:{id:this.state.idAtividade}}
        console.log(json)
        axios.post(`${URL}comentario/analista/cadastrar`,json,config)
            .then(resp => toast.success('Comentário realizado com sucesso!',
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                })).then(resp=> this.setState({...this.state,comentario:""})).then(resp=>this.refresh())
            .catch(err => toast.error('Não foi possível comentar nessa atividade, tente novamente.',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))
    }


    render() {
        if (this.usuario == null || this.usuario === "gestor") {
            return (<Redirect to ="/"/> );
        }

        return (
            <div>
                <div className="row">
                    <div className="text-center mb-3 col-md-8 ">
                        <div className="scrollbar scrollbar-primary">
                            <div className="container">
                                <ListaComentarios comentarios={this.state.comentarios}/>
                            </div>
                        </div>

                        <div className="text-comentario p-2 row m-auto">
                            <div className="col-md-9 col-sm-9">
                                <Input type="textarea"  onChange={this.setComentario.bind(this)} value={this.state.comentario} name="text" id="inputComentario" />
                            </div>
                            <div className="col-md-3 p-3 col-sm-3">
                                <Button className="btn btn-block btn-success btn-round" onClick={this.enviarComentario.bind(this)}>Adicionar</Button>
                            </div>
                        </div>
                    </div>

                    <div className="d-none d-md-inline-block vl"></div>

                    <div className="col-md-3 p-3">
                        <h5>Colaboradores</h5>
                        <div className="col-md-12">
                            <img src="photo/default.jpg" className="icon-size" alt="photo-perfil"/>
                            <span className="ml-2">Renan Goveia</span>
                        </div>
                    </div>
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false} closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover />
                {/* Same as */}
                <ToastContainer />
            </div>
        );
    }
}
