import React, { Component } from 'react';
import {Redirect,Link} from 'react-router-dom';
import { Line } from 'rc-progress';
import ReactStars from 'react-stars'
import axios from 'axios';
import ButtonAtividade from './buttonAtividade';
import { ToastContainer, toast } from 'react-toastify';
import HorarioTrabalho from './horarioTrabalho';
import ListarComentariosAnalista from './listarComentariosAnalista'
import {URL} from '../../global'
import $ from 'jquery'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Input,
    ModalFooter,
} from 'reactstrap';


export default class DetalheAtividade extends Component {
    constructor(){
        super();
        var usuario = localStorage.getItem('user');
        this.atividadeId = sessionStorage.getItem('idAtividadeAnalista')
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
        this.keyHandler = this.keyHandler.bind(this);
        this.loadImages = this.loadImages.bind(this);

        this.state = {
            modalAnexo: false,
            atividade: {},
            projeto: {},
            comentario: "",
            horarioTrabalho: [],
            totalTrabalho: "",
            alocados: [],
            anexo: [],
            anexoFile: null,
            progressUpload: 0,
            imagesComentarios:[],
            enviaComentarioFlag:true
        };
        this.refresh()
        if(usuario == null){
            this.usuario = null;
        } else {
            this.usuario = user.perfilAcesso;
        }
    }

    refresh(){
        this.getLocation()
        const idAtividade = sessionStorage.getItem('idAtividadeAnalista')
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        axios.get(`${URL}atividade/analista/detalhe/${idAtividade}`, config)
            .then(resp => this.setState({
                    ...this.state,
                    atividade: resp.data.response
                })
            )
            .then(resp => {
                    this.setState({
                        projeto: this.state.atividade.projeto,
                        alocados: this.state.atividade.historicoAlocacao
                    });
                    if(this.state.enviaComentarioFlag) this.loadImages()
                }
            )
            .then(
                axios.get(`${URL}historico-trabalho/analista/lista-horario/${idAtividade}`, config)
                    .then(resp => this.setState({
                            ...this.state,
                            horarioTrabalho: resp.data.response,
                            totalTrabalho: resp.data.message
                        })
                    )
            )
            .then(
                axios.get(`${URL}anexo/analista/list/${idAtividade}`, config)
                    .then(resp => this.setState({
                            ...this.state,
                            anexo: resp.data.response
                        })
                    )
            )
    }

    async loadImages(){
        this.setState({imagesComentarios:[]});
        for(let i = 0; i< this.state.alocados.length; i++){
            let imagePath = this.state.alocados[i].usuario.imagePath;
            let name = this.state.alocados[i].usuario.nome + " " + this.state.alocados[i].usuario.sobreNome;
            let id = this.state.alocados[i].usuario.id;
            if(imagePath !== null){
                var config = {headers: {Authorization: this.token}};
                await axios.get(`${URL}usuario/analista/getimage/${imagePath}`, config)
                    .then(resp =>{
                        let newList = this.state.imagesComentarios;
                        newList.push({id:id, name:name, photo:resp.data.response})
                        this.setState({imagesComentarios:newList})
                    });
            }else {
                let newList = this.state.imagesComentarios;
                newList.push({id:id, name:name, photo:null})
                this.setState({imagesComentarios:newList})
            }

        }
        this.setState({enviaComentarioFlag:true});
        //console.log(this.state.imagesComentarios)
    }

    atualizarHorarioTrabalho(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        axios.get(`${URL}historico-trabalho/analista/lista-horario/${this.atividadeId}`,config)
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

        axios.get(`${URL}anexo/analista/list/${idAtividade}`, config)
        .then(resp => this.setState(
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
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', localArmazenamento);
                document.body.appendChild(link);
                link.click();
            });
    }

    setComentario(event){

        this.setState({comentario:event.target.value})
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

    enviarComentario(){
        var config = {headers:{Authorization:this.token}};
        const json = {comentario:this.state.comentario,atividade:{id:this.state.atividade.id}};
        this.setState({enviaComentarioFlag:false});
        axios.post(`${URL}comentario/analista/cadastrar`,json,config)
            .then(resp => toast.success('Comentário realizado com sucesso!',
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                }))
            .then(resp=> this.setState({...this.state,comentario:""})).then(resp=>this.refresh())
            .then(resp=> $('#textdiv').animate({scrollTop: $('#textdiv').prop("scrollHeight")}, 500))
            .catch(err => toast.error('Não foi possível comentar nessa atividade, tente novamente.',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))
    }

    keyHandler(e) {
        const { add, clear, search, description } = this.props
        if (e.key === 'Enter') {
            this.enviarComentario()
        }
    }

    changeStatus(id){


        var coord = JSON.parse(sessionStorage.getItem("location"))
        var config = {headers:{Authorization:this.token}};
        let json;
        if(coord == null){
            json = {
                atividade: {
                    id: this.atividadeId
                },
                latitude: "",
                longitude: ""
            }
        } else {
            json = {
                atividade: {
                    id: this.atividadeId
                },
                latitude: coord.latitude,
                longitude: coord.longitude
            }
        }

        if(id==null){
            axios.post(`${URL}historico-trabalho/analista/registrar`, json, config)
                .then(resp => this.atualizarHorarioTrabalho())
        }
        else{
            const pause = {
                id: id,
                atividade: {
                    id: this.atividadeId
                }
            }
            axios.post(`${URL}historico-trabalho/analista/finalizar-trabalho`, pause, config)
                .then(resp => this.atualizarHorarioTrabalho())
        }
    }

    finalizarAtividade(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };
        var json = { id: this.atividadeId }
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
            let list = this.state.anexo || [];
            return list.map(anexo => (
                <tr key={anexo.id}>
                    <td className="link-style" onClick={()=> {this.downloadAnexo((anexo.localArmazenamento + anexo.nomeAquivo))}} >{anexo.nomeAquivo}</td>
                    <td>{anexo.tamanho} kbps</td>
                    <td>{anexo.usuario.nome} {anexo.usuario.sobreNome}</td>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => this.deleteAnexo(anexo)}>Remover</button>
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
                if(this.state.atividade.status === 'finalizada'){
                    return(<button onClick={this.showModal.bind(this, 'modal3')} className="btn btn-danger" style={{"float": "right"}} disabled>Finalizar atividade</button>)
                } else {
                    return(
                        <button onClick={this.showModal.bind(this, 'modal3')} className="btn btn-danger" style={{"float": "right"}}>Finalizar atividade</button>
                    )
                }
            }
        }

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
                        <a className="nav-link" id="comentarios-atividade-tab" data-toggle="tab" href="#comentarios-atividade1" role="tab" aria-controls="comentarios-atividade" aria-selected="false">Comentários</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="anexos-atividade-tab" data-toggle="tab" href="#anexos-atividade" role="tab" aria-controls="anexos-atividade" aria-selected="false">Anexos</a>
                    </li>
                    
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show pt-3 active" id="dados-atividade" role="tabpanel" aria-labelledby="dados-atividade-tab">
                        <div className="row">
                            <div className="col-md-12">
                                <p style={{"fontSize":"18px"}}>
                                    <small><strong>Projeto:</strong> ({this.state.projeto.numeroProjeto}){this.state.projeto.nome}</small>
                                </p>
                                <span style={{"fontSize":"20px"}}>
                                    <strong>Atividade:</strong> {this.state.atividade.nome} <i> {(this.state.atividade.status ==='finalizada'? '(finalizada)':'')} </i>
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
                                <label style={{"fontSize":"12px"}}><strong>Descrição:</strong></label>
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
                                        <label className="btn btn-sm btn-primary btn-round col-sm-12 col-md-2" htmlFor="input-anexo">
                                            Selecionar arquivo
                                        </label>
                                        <span className="p-2 col-sm-3"
                                        id="file-name">{(this.state.anexoFile == null)? 'Nenhum arquivo selecionado' : this.state.anexoFile.name}</span>
                                    </div>
                                    <div className="col-md-12">
                                    <button className="btn btn-success btn-round btn-sm col-md-1" onClick={this.fileUpload}>Enviar</button>
                                    <Line percent={this.state.progressUpload} strokeWidth="1" strokeColor="#85d262" className="col-md-11"/>
                                    </div>
                                </div>
                                <table className="table m-3">
                                    <thead>
                                    <tr>
                                        <th scope="col">Nome Arquivo</th>
                                        <th scope="col">Tamanho</th>
                                        <th scope="col">Usuário</th>
                                        <th scope="col">Opções</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {listaAnexo()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="tab-pane fade pt-3" id="comentarios-atividade1" role="tabpanel" aria-labelledby="comentarios-atividade-tab2">

                            <div className="row">

                                <div className="col-md-8 row">
                                        <div className="col-md-12">
                                            <div id="textdiv" className="scrollbar scrollbar-primary" style={{'width':'100%'}}>
                                            <ListarComentariosAnalista
                                                comentarios={this.state.atividade.comentarios}/>
                                            </div>
                                                <div className="text-comentario p-2 row">
                                                    <div className="col-md-9 col-sm-9">
                                                        <Input type="textarea"  onChange={this.setComentario.bind(this)} value={this.state.comentario}
                                                        onKeyUp={this.keyHandler} name="text" id="inputComentario" />
                                                    </div>
                                                    <div className="col-md-3 p-3 col-sm-3 m-auto">
                                                        <Button className="btn btn-success btn-round" onClick={this.enviarComentario.bind(this)}>Enviar</Button>
                                                    </div>
                                            </div>
                                        </div>
                                </div>
                                    <div className="d-none d-md-inline-block vl"></div>
                                    <div className="col-md-3 p-3">
                                        <h5>Colaboradores</h5>
                                            <div className="col-md-12">
                                                {
                                                    this.state.imagesComentarios.map(function(analista){
                                                        if (analista.photo === null) {
                                                            return(
                                                                <div key={analista.id}  style={{'marginBottom':'5px'}}>
                                                                    <img src="photo/default.jpg" className="icon-size" alt="photo-perfil"/>

                                                                    <span className="ml-2">{analista.name}</span>
                                                                </div>
                                                            );
                                                        } else {
                                                            return(
                                                                <div key={analista.id}  style={{'marginBottom':'5px'}}>
                                                                    <img src={"data:image/jpeg;charset=utf-8;base64, " + analista.photo} className="icon-size" alt="photo-perfil"/>

                                                                    <span className="ml-2">{analista.name}</span>
                                                                </div>
                                                            );
                                                        }
                                                    }.bind(this))
                                                }


                                            </div>
                                    </div>
                            </div>
                    </div>
                </div>

                <Modal isOpen={this.state.modal3} toggle={this.closeModal.bind(this, 'modal3')} className={this.props.className}>
                    <ModalHeader toggle={this.closeModal.bind(this, 'modal3')}>Deseja realmente finalizar atividade?</ModalHeader>
                    <ModalBody>
                        <p>Se você finalizar a atividade, não será possível retomá-la.</p>
                        <Button color="btn btn-default mt-2" onClick={this.closeModal.bind(this, 'modal3')}>Cancelar</Button>
                        <Button color="btn btn-primary float-right mt-2" onClick={this.finalizarAtividade.bind(this)}>Finalizar</Button>
                    </ModalBody>
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