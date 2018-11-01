import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import { Line } from 'rc-progress';
import ReactStars from 'react-stars'
import axios from 'axios';
import ButtonAtividade from './buttonAtividade';
import { ToastContainer, toast } from 'react-toastify';
import HorarioTrabalho from './horarioTrabalho';
import {URL} from '../../global'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import VisualizarComentarios from './visualizarComentarios';


export default class DetalheAtividade extends Component {
    constructor(){
        super();
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.usuario = user;
        this.token = user.token.numero;
        this.toggle = this.toggle.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.atualizarHorarioTrabalho = this.atualizarHorarioTrabalho.bind(this);
        this.downloadAnexo = this.downloadAnexo.bind(this);
        this.atualizaListAnexo = this.atualizaListAnexo.bind(this);
        this.deleteAnexo = this.deleteAnexo.bind(this);

        this.state = {
            modalAnexo: false,
            atividade: {},
            idAtividade: 0,
            comentario: "",
            horarioTrabalho: [],
            totalTrabalho: "",
            alocados: [],
            anexo: [],
            anexoFile: null,
            progressUpload: 0
        };

        if(usuario == null){
            this.usuario = null;
        } else {
            this.usuario = user.perfilAcesso;
        }
    }

    componentDidMount(){
        this.getLocation()
        const idAtividade = sessionStorage.getItem('idAtividadeAnalista')

        this.setState(
            {
                ...this.state,
                idAtividade: idAtividade
            }
        );

        var config = {
            headers: {
                Authorization: this.token
            }
        };

        axios.get(`${URL}atividade/analista/detalhe/${idAtividade}`, config)
            .then(resp => this.setState(
                {
                    ...this.state,
                    atividade: resp.data.response
                }
                )
            )
            .then(resp=> console.log(this.state.atividade.historicoAlocacao))
            .then(resp=> this.setState({alocados:this.state.atividade.historicoAlocacao}))
        axios.get(`${URL}historico-trabalho/analista/lista-horario/${idAtividade}`, config)
            .then(resp => this.setState(
                {
                    ...this.state,
                    horarioTrabalho: resp.data.response,
                    totalTrabalho: resp.data.message
                }
                )
            );
        axios.get(`${URL}anexo/analista/list/${idAtividade}`, config).then(resp => this.setState(
            {
                ...this.state,
                anexo: resp.data.response
            }
            )
        )
    }

    atualizarHorarioTrabalho(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        axios.get(`${URL}historico-trabalho/analista/lista-horario/${this.state.idAtividade}`,config)
            .then(resp => this.setState(
                {
                    ...this.state,
                    horarioTrabalho: resp.data.response,
                    totalTrabalho: resp.data.message
                }
                )
            );
    }

    atualizaListAnexo(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };
        const idAtividade = sessionStorage.getItem('idAtividadeAnalista')

        axios.get(`${URL}anexo/analista/list/${idAtividade}`, config).then(resp => this.setState(
            {
                ...this.state,
                anexo: resp.data.response
            }
            )
        )
    }

    getLocation(){
        var options = {
            enableHighAccuracy: false,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
        function success(pos) {
            var crd = pos.coords;
            var json = JSON.stringify(
                {
                    latitude: crd.latitude,
                    longitude: crd.longitude
                }
            );
            sessionStorage.setItem("location", json);
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
    }

    closeModal(tabId){
        this.setState({
            [tabId]: false
        });
    }

    fileSelected (event){
        this.setState(
            {
                anexoFile: event.target.files[0]
            }
        );
    }

    deleteAnexo(anexo){
        var config = {
            headers: {
                Authorization: this.token
            }
        };
        anexo = {...anexo, atividade:{id: this.state.atividade.id}}
        console.log(anexo)
        axios.post(`${URL}anexo/analista/delete`, anexo, config)
            .then(resp => this.atualizaListAnexo())
            .then(resp => toast.success("Anexo deletado com sucesso!"), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            })
            .catch(resp => toast.warn("Falha ao deletar anexo",{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))
    }


    fileUpload(){

        if(this.state.anexoFile == null){
            toast.warn("Nenhum arquivo selecionado", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true})
            return;
        }else {
            const formData = new FormData();
            formData.append('anexo', this.state.anexoFile, this.state.anexoFile.name);
            formData.append('idAtividade', this.state.atividade.id);
            var config = {
                headers: {
                    Authorization: this.token
                },
                onUploadProgress: progressEvent => {
                    this.setState(
                        {
                            ...this.state,
                            progressUpload: Math.round(progressEvent.loaded / progressEvent.total * 100)
                        }
                    )
                }
            };
            axios.post(`${URL}anexo/analista/upload`,formData,config)
                .then(resp => this.setState({anexoFile: null, progressUpload: 0}))
                .then(resp => this.atualizaListAnexo())
                .then(resp => toast.success('Anexo enviado com sucesso!',
                    {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }));
        }
    }

    downloadAnexo(localArmazenamento){
        console.log(localArmazenamento)
        axios({
            url: URL+'anexo/analista/download/'+localArmazenamento,
            method: 'GET',
            responseType: 'blob', // important
            headers: {
                Authorization:this.token
            }
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                console.log(response)
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', localArmazenamento);
                document.body.appendChild(link);
                link.click();
            });
    }

    showModal(modal){
        this.setState({
            [modal]: true
        });
    }

    toggle(){
        this.setState({
            modal: !this.state.modal
        });
    }

    visualizar(){
        this.props.history.push("/visualizarComentarios");
    }

    setComentario(event){
        console.log(event.target.value);
        this.setState({
            comentario:event.target.value
        });
    }

    changeStatus(id){
        var coord = JSON.parse(sessionStorage.getItem("location"))
        var config = {headers:{Authorization:this.token}};
        let json;
        if(coord == null){
            json = {
                atividade: {
                    id: this.state.idAtividade
                },
                latitude: "",
                longitude: ""
            }
        } else {
            json = {
                atividade: {
                    id: this.state.idAtividade
                },
                latitude: coord.latitude,
                longitude: coord.longitude
            }
        }

        if(id==null){
            axios.post(`${URL}historico-trabalho/analista/registrar`, json, config)
                .then(resp => console.log(resp.data))
                .then(resp => this.atualizarHorarioTrabalho())
        }
        else{
            const pause = {
                id: id,
                atividade: {
                    id: this.state.idAtividade
                }
            }
            axios.post(`${URL}historico-trabalho/analista/finalizar-trabalho`, pause, config)
                .then(resp => console.log(resp.data))
                .then(resp => this.atualizarHorarioTrabalho())
        }
    }

    finalizarAtividade(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };
        var json = { id: this.state.idAtividade }
        axios.post(`${URL}atividade/analista/finalizar`,json,config)
            .then(resp => this.setState(
                {
                    ...this.state,
                    atividade: resp.data.response
                }
                )
            )
            .then(resp => this.atualizarHorarioTrabalho())
        this.closeModal('modal3');
    }

    enviarComentario(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        const json = {
            comentario: this.state.comentario,
            atividade: {
                id: this.state.idAtividade
            }
        }
        axios.post(`${URL}comentario/analista/cadastrar`, json, config)
            .then(resp => toast.success('Comentário realizado com sucesso!',
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                }
                )
            )
            .then(resp=> this.setState(
                {
                    ...this.state,
                    comentario:""
                }
                )
            )
            .catch(err => toast.error('Não foi possível comentar nessa atividade, tente novamente.',
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                }
                )
            );

        this.closeModal('modal2');
    }


    render(){
        const formataDataCriacao = (data) => {
            let dataFormatada = String(data);
            dataFormatada = dataFormatada.split("-");
            let diaFormatado = String(dataFormatada[2]);
            diaFormatado = diaFormatado.split("T")[0];
            return diaFormatado+"/"+dataFormatada[1]+"/"+dataFormatada[0];
        }

        const formataDataEntrega = (data) => {
            let dataFormatada = String(data);
            dataFormatada = dataFormatada.split("-");
            return dataFormatada[2]+"/"+dataFormatada[1]+"/"+dataFormatada[0];
        }

        const listaAnexo = () => {
            let list = this.state.anexo;
            return list.map(anexo => (
                <tr key={anexo.id}>
                    <td onClick={()=> {this.downloadAnexo((anexo.localArmazenamento + anexo.nomeAquivo))}} >{anexo.nomeAquivo}</td>
                    <td onClick={()=> {this.downloadAnexo((anexo.localArmazenamento + anexo.nomeAquivo))}} >{anexo.tamanho}</td>
                    <td onClick={()=> {this.downloadAnexo((anexo.localArmazenamento + anexo.nomeAquivo))}} >{anexo.usuario.nome}</td>
                    <td>
                        <button className="btn btn-outline-danger btn-round" onClick={() => this.deleteAnexo(anexo)}>Remover</button>
                    </td>
                </tr>
            ))
        }

        if(this.usuario == null || this.usuario === "gestor") {
            return (
                <Redirect to ="/"/>
            );
        }

        const buttonFinalizar = () => {
            {
                if(this.state.atividade.status == 'finalizada'){
                    return(<button onClick={this.showModal.bind(this, 'modal3')} className="btn btn-danger" style={{"float": "right"}} disabled>Finalizar atividade</button>)
                } else {
                    return(
                        <button onClick={this.showModal.bind(this, 'modal3')} className="btn btn-danger" style={{"float": "right"}}>Finalizar atividade</button>
                    )
                }
            }
        }
        console.log(this.state.alocados)
        return (
            <div>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Atividade</li>
                </ol>

                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="dados-atividade-tab" data-toggle="tab" href="#dados-atividade" role="tab" aria-controls="dados-atividade" aria-selected="true">Dados</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="anexos-atividade-tab" data-toggle="tab" href="#anexos-atividade" role="tab" aria-controls="anexos-atividade" aria-selected="false">Anexos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="comentarios-atividade-tab" data-toggle="tab" href="#comentarios-atividade" role="tab" aria-controls="comentarios-atividade" aria-selected="false">Comentários</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show pt-3 active" id="dados-atividade" role="tabpanel" aria-labelledby="dados-atividade-tab">
                        <div className="row">
                            <div className="col-md-12">
                                <span style={{"font-size":"20px"}}>
                                    {this.state.atividade.nome} <i> {(this.state.atividade.status ==='finalizada'? '(finalizada)':'')} </i>
                                </span>
                                <div>
                                    <ReactStars
                                        count={5}
                                        value={this.state.atividade.complexidade}
                                        size={22}
                                        edit={false}
                                        color2={'#ffd700'} />
                                </div>
                                {buttonFinalizar()}
                                <br/>
                                <small className="text-muted">
                                    <strong>Criação: </strong>{formataDataCriacao(this.state.atividade.dataCriacao)} -
                                    <strong> Entrega: </strong> {formataDataEntrega(this.state.atividade.dataEntrega)}
                                </small>
                                <hr/>
                            </div>

                            <div className="col-md-6">
                                <label style={{"font-size":"12px"}}>Descrição</label>
                                <div className="card-detail-atividade">
                                    <span>{this.state.atividade.descricao}</span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div>
                                    <h5>Hórario de trabalho</h5>
                                </div>
                                <div className="padding-bottons-atividade">
                                    <ButtonAtividade
                                        button={this.changeStatus.bind(this)}
                                        list={this.state.horarioTrabalho}
                                        status={this.state.atividade.status}/>
                                </div>
                                <div>
                                    <HorarioTrabalho 
                                    horarioTrabalho={this.state.horarioTrabalho} 
                                    totalTrabalho={this.state.totalTrabalho}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade pt-3" id="anexos-atividade" role="tabpanel" aria-labelledby="anexos-atividade-tab">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="input-anexo-atividade">
                                    <div className="col-md-12 col-sm-2 p-1">
                                        <input id="input-anexo" type="file" onChange={this.fileSelected}/>
                                        <span className="p-2 col-sm-3" 
                                        id="file-name">{(this.state.anexoFile == null)? 'Nenhum arquivo selecionado' : this.state.anexoFile.name}</span>

                                        <label className="btn btn-primary btn-round" for="input-anexo">
                                            Selecionar arquivo
                                        </label>
                                    </div>
                                    <button className="btn btn-success btn-round" onClick={this.fileUpload}>Enviar <i className="fas fa-upload"></i></button>
                                </div>
                                <Line percent={this.state.progressUpload} strokeWidth="1" strokeColor="#85d262" />
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Nome Arquivo</th>
                                        <th scope="col">Tamanho</th>
                                        <th scope="col">Usuário</th>
                                        <th scope="col">Opções</th>
                                    </tr>
                                    </thead>
                                    <tbody className="curso-pointer">
                                    {listaAnexo()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade pt-3" id="comentarios-atividade" role="tabpanel" aria-labelledby="comentarios-atividade-tab">
                        <div className="row">
                            <div className="col-md-12">
                                <VisualizarComentarios 
                                   props={this.props} />
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={this.state.modal3} toggle={this.closeModal.bind(this, 'modal3')} className={this.props.className}>
                    <ModalHeader toggle={this.closeModal.bind(this, 'modal3')}>Deseja realmente finalizar atividade?</ModalHeader>
                    <ModalBody>
                        <Button color="btn btn-default mt-2" onClick={this.closeModal.bind(this, 'modal3')}>Cancelar</Button>
                        <Button color="btn btn-primary float-right mt-2" onClick={this.finalizarAtividade.bind(this)}>Finalizar</Button>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.modalAnexo} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

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
                <ToastContainer />
            </div>
        );
    }
}