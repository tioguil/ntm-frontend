import React, { Component } from 'react';
import {
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter } from 'reactstrap';
import axios from 'axios'
import {Link} from 'react-router-dom';
import {URL,CEP} from '../global'
import Photo from "../components/Photo";
import PubSub from 'pubsub-js';
import {toast, ToastContainer} from "react-toastify";
import InputMask from 'react-input-mask';

export default class EditarPerfil extends Component {
    constructor(props){
        super(props);
        let img = localStorage.getItem('imgPerfil');
        let usuario = JSON.parse(localStorage.getItem('user'));
        this.state = {
            modal: false,
            nome:usuario.nome,
            cpfCnpj:usuario.cpfCnpj,
            rg:usuario.rg,
            sobreNome: usuario.sobreNome,
            telefone:usuario.telefone,
            celular:usuario.celular,
            cep:usuario.cep,
            perfilAcesso: usuario.perfilAcesso,
            endereco:usuario.endereco,
            enderecoNumero:usuario.enderecoNumero,
            complemento:usuario.complemento,
            email: usuario.email,
            cidade:usuario.cidade,
            uf:usuario.uf,
            imagePerfil: img,
            token:{ numero: usuario.token.numero},
            imageFile: null,
            senhaAtual: "",
            novaSenha: ""
        }
        this.editar = this.editar.bind(this);
        this.atualizaLocalStorage = this.atualizaLocalStorage.bind(this);
        this.imageSelect = this.imageSelect.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.getImage = this.getImage.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    closeModal(modal) {
        if(modal === 'editar_senha'){
            this.setState({
                senhaAtual: "",
                novaSenha: ""
            });
        }

        this.setState({
            [modal]: false
        });
    }

    showModal(modal) {
        if(modal === 'editar_senha'){
            this.setState({
                [modal]: true
            });
        }
    }

    dadosSenha(nomeInput, evento){
        var campoSendoAlterado = {}
        campoSendoAlterado[nomeInput] = evento.target.value
        this.setState(campoSendoAlterado)
    }

    editarSenha() {
        const json = {
          senha: this.state.senhaAtual,
          novaSenha: this.state.novaSenha
        }

        var config = {
          headers: {
            Authorization: this.state.token.numero
          }
        };

        axios.post(`${URL}usuario/analista/atualizarsenha`, json, config)
          .then(resp => toast.success(
            resp.data["message"],
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            })
          )
          .then(this.closeModal.bind(this, 'editar_senha'))
          .catch(resp => toast.error(
            resp.response.data["message"],
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            })
          )
    }

    dadosUsuario(nomeInput,evento){
        var campoSendoAlterado = {}
        campoSendoAlterado[nomeInput] = evento.target.value
        if (nomeInput=='cep' && !evento.target.value.endsWith('_')){
        axios.get(`${CEP}${evento.target.value}/json/`)
            .then(resp=> {this.state, this.setState({endereco:resp.data.logradouro,uf:resp.data.uf,cidade:resp.data.localidade})})
        }
        this.setState(campoSendoAlterado)
    }

    editar(){
        
        var config = {headers:{Authorization:this.state.token.numero}};
        axios.post(`${URL}usuario/analista/editar_perfil`,this.state,config)
            .then(resp=> this.atualizaLocalStorage(resp.data))
            .then(res => {
            if(this.state.imageFile != null){
                this.uploadImage()
            }else {
                toast.success('Dados salvos com sucesso!',
                    {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    })
            }


        })
    }

    atualizaLocalStorage(response){
        let user = response.response
        user.token.numero = this.state.token.numero;
        localStorage.setItem("user", JSON.stringify(user));
    }

    uploadImage(img){
        if(img == null){
            return;
        }else {
            const formData = new FormData();
            formData.append('image', img, img.name);
            var config = {
                headers: {
                    Authorization: this.state.token.numero
                }
            };
            axios.post(`${URL}usuario/analista/uploadimage`,formData,config)
                .then(resp => this.getImage(resp.data.response.diretorio))
                .then(resp => toast.success('Dados salvos com sucesso!',
                    {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }));
        }
    }

    getImage(nameFile){
        var config = {
            headers: {
                Authorization: this.state.token.numero
            }
        };
        axios.get(`${URL}usuario/analista/getimage/${nameFile}`,config)
            .then(resp => {
                this.setState({imagePerfil: resp.data.response});
                localStorage.setItem("imgPerfil", resp.data.response);
                PubSub.publish('atualiza');
            })
            // .then(resp => this.setState({imageFile: null}))
    }

    imageSelect(event){
        // this.setState({imageFile: event.target.files[0]});
        this.uploadImage(event.target.files[0])
    }
    render(){
        const imageData = {user: {
                name: this.state.nome + " " +this.state.sobreNome,
                profile_image: "photo/default.jpg"
            }
        }
        return(
            <div>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to={this.state.perfilAcesso === "gestor" ? "/dashboardAdmin" : "/dashboard"}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Editar Perfil</li>
                </ol>

                <h3>Editar Perfil</h3>
                <hr/>
                <div className="row">
                    <div className="col-md-4 col-sm-12">
                        <div className="App">
                            <div className="text-center">
                                <label htmlFor="imagePerfil" className="btn-custom">
                                    <span className="fas fa-camera btn-icon curso-pointer" title="Selecionar foto"></span>
                                </label>
                                <Photo {...imageData} 
                                    srcImage={this.state.imagePerfil} />
                                <input type="file" id="imagePerfil" onChange={this.imageSelect}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="container-fluid mb-3">
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
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputCpf">CPF:</label>
                                        <Input type="text" className="form-control required" value={this.state.cpfCnpj} onChange={this.dadosUsuario.bind(this, "cpfCnpj")} id="inputCpf" placeholder="999.999.999-99" mask="999.999.999-99" tag={InputMask} disabled/>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputRg">RG:</label>
                                        <Input type="text" className="form-control" value={this.state.rg} onChange={this.dadosUsuario.bind(this, "rg")} placeholder="99.999.999-9" id="inputRg" mask="99.999.999-*" tag={InputMask} disabled/>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputEmail" >Email:</label>
                                        <Input disabled type="text" className="form-control required" value={this.state.email} onChange={this.dadosUsuario.bind(this, "email")} id="inputEmail" placeholder="Email"/>
                                    </div>

                                    <div className="form-group col-md-3">
                                        <label htmlFor="inputTelefone">Telefone:</label>
                                        <Input type="text" className="form-control" value={this.state.telefone} onChange={this.dadosUsuario.bind(this, "telefone")} id="telefone" placeholder="(11)xxxx-xxxx" mask="(99) 9999-9999" tag={InputMask}/>
                                    </div>

                                    <div className="form-group col-md-3">
                                        <label htmlFor="inputCelular" className="required">Celular:</label>
                                        <Input type="text" className="form-control" value={this.state.celular} onChange={this.dadosUsuario.bind(this, "celular")} id="celular" placeholder="(11)9xxxx-xxxx" mask="(99) 99999-9999" tag={InputMask}/>
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

                                    <div className="form-group col-md-4">
                                        <label htmlFor="inputComplemento">Complemento:</label>
                                        <Input type="text" className="form-control" value={this.state.complemento} onChange={this.dadosUsuario.bind(this, "complemento")} id="inputComplemento" placeholder="Apto, Casa 2 ..."/>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                        <label htmlFor="inputCep" >CEP:</label>
                                        <Input type="text" className="form-control" value={this.state.cep} onChange={this.dadosUsuario.bind(this, "cep")} id="inputCep" placeholder="00000-000" mask="99999-999" tag={InputMask}/>
                                    </div>

                                    <div className="form-group col-md-5">
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

                                <div className="text-right">
                                    <button type="button" onClick={this.showModal.bind(this, 'editar_senha')} className="btn btn-primary mr-2 mb-3 btn-round">Editar senha</button>
                                    <button type="button" onClick={this.editar} className="btn btn-success mb-3 btn-round">Salvar</button>
                                </div>
                                <h2 className="text-white perfil-usuario">{this.perfilAcesso}</h2>
                            </form>
                        </div>
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
                    <ToastContainer />
                </div>

                <Modal isOpen={this.state.editar_senha} toggle={this.closeModal.bind(this, 'editar_senha')} className="modal-dialog">
                    <ModalHeader className="card-header" toggle={this.closeModal.bind(this, 'editar_senha')}>Editar senha</ModalHeader>
                    <ModalBody className="card-header">
                        <form className="form-row">
                            <div className="form-group col-md-12">
                                <label htmlFor="inputSenhaAtual">Senha atual:</label>
                                <Input type="password" className="form-control" id="inputSenhaAtual" value={this.state.senhaAtual} onChange={this.dadosSenha.bind(this, "senhaAtual")}/>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputNovaSenha">Nova senha:</label>
                                <Input type="password" className="form-control" id="inputNovaSenha" value={this.state.novaSenha} onChange={this.dadosSenha.bind(this, "novaSenha")}/>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter className="card-header">
                      <button onClick={this.editarSenha.bind(this)} className="btn btn-success float-right mt-2 btn-round">Salvar</button>
                    </ModalFooter>
                  </Modal>
            </div>
        );
    }
}
