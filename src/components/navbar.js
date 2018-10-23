import React, { Component } from 'react';
import {Link,Redirect} from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Photo from "../components/Photo";





export default class Navbar extends Component {

    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.state = {nome:user.nome,modal:false}
        this.perfilAcesso = user.perfilAcesso

    }
    componentDidMount(){
        const script = document.createElement("script");
        script.src = "./js/scripts.js";
        script.async = true;
        document.body.appendChild(script);
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

                <span className="text-white perfil-usuario">{this.perfilAcesso}</span>

                <div className="d-md-inline-block ml-auto mr-0 mr-md-3 my-2 my-md-0">
                    <ul className="navbar-nav ml-auto ml-md-0">
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-bell fa-fw"></i>
                                <span className="badge badge-danger">9+</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="alertsDropdown">
                                <a className="dropdown-item" href="#">Opção 1</a>
                                <a className="dropdown-item" href="#">Opção 2</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Opção 3</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-envelope fa-fw"></i>
                                <span className="badge badge-danger">7</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="messagesDropdown">
                                <a className="dropdown-item" href="#">Opção 1</a>
                                <a className="dropdown-item" href="#">Opção 2</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Opção 3</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                <span>
                                    <img src="photo/default.jpg" className="icon-size" alt="photo-perfil"/>
                                    {this.state.nome}
                                </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                                <Link className="dropdown-item" to="/editarPerfil">Configurações</Link>
                                <a className="dropdown-item" href="#">Registro de Atividades</a>
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
