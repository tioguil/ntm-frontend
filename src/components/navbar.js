import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PubSub from 'pubsub-js';
import PhotoNav from './photoNav';
import axios from "axios";
import {URL} from "../global";

export default class Navbar extends Component {

    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.state = {nome:user.nome,modal:false,imagePerfil: null, usuario:JSON.parse(usuario)};
        this.perfilAcesso = user.perfilAcesso;
        this.atualiza = this.atualiza.bind(this)
    }
    componentDidMount(){
        if(localStorage.getItem('imgPerfil') === null){
            var config = {
                headers: {
                    Authorization: this.state.usuario.token.numero
                }
            };
            if(this.state.usuario.imagePath !== undefined){
                axios.get(`${URL}usuario/analista/getimage/${this.state.usuario.imagePath}`,config)
                    .then(resp => {
                        localStorage.setItem("imgPerfil", resp.data.response);
                        this.setState({imagePerfil: resp.data.response});
                    })
            }
        }else {
            let imagePerfil = localStorage.getItem('imgPerfil');
            this.setState({imagePerfil: imagePerfil})
        }

        const script = document.createElement("script");
        script.src = "./js/scripts.js";
        script.async = true;
        document.body.appendChild(script);
        PubSub.subscribe('atualiza', () => {this.atualiza()})
    }


    atualiza(){
        this.image = localStorage.getItem('imgPerfil');
        this.setState({imagePerfil: this.image})

    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    logout(props){
        this.toggle()
        localStorage.clear();
        sessionStorage.clear()
    }

    render(){
        const imageData = {user: {
                profile_image: "photo/default.jpg"
            }
        }
        return(
            <nav className="navbar navbar-expand navbar-dark bg-dark static-top">
                <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)} className={this.props.className}>
                    <ModalHeader toggle={this.toggle.bind(this)}>Deseja sair?</ModalHeader>
                    <ModalBody>
                        Clique em "Sair" para encerrar a sua sessão.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle.bind(this)}>Cancelar</Button>
                        <Link  className="btn btn-primary" to="/" onClick={this.logout.bind(this)}> Sair</Link>
                    </ModalFooter>
                </Modal>

                <button className="btn btn-link btn-sm text-white order-1 order-sm-0" id="sidebarToggle" href="#">
                    <i className="fas fa-bars"></i>
                </button>

                <span className="text-white perfil-usuario text-capitalize">{this.perfilAcesso}</span>

                <div className="d-md-inline-block ml-auto mr-0 mr-md-3 my-2 my-md-0">
                    <ul className="navbar-nav ml-auto ml-md-0">
                        
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <PhotoNav
                                    nome={this.state.nome}
                                    img={localStorage.getItem('imgPerfil')}
                                />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <Link className="dropdown-item" to="/editarPerfil">Configurações</Link>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="javascript:void(0)" onClick={this.toggle.bind(this)}>Sair</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
