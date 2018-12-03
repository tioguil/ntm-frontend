import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Line } from 'rc-progress';
import Select, { Option } from 'rc-select';
import { ToastContainer, toast } from 'react-toastify';
import ReactStars from 'react-stars';
import axios from 'axios';
import {URL} from '../../global';
import $ from 'jquery'
import ListaComentariosGestor from './listaComentariosGestor';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input } from 'reactstrap';

export default class Atividades extends Component {
    constructor(props){
        super(props);
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.usuario = user;
        this.token = user.token.numero;
        this.atividadeId = 0;
        this.state = {
            atividade: {},
            dataEntrega: "",
            modal: false,
            comentario: "",
            alocados: [],
            usuario: {
                id: 0
            },
            analistas: [],
            comentarios: [],
            esforco: [],
            value: "",
            anexo: [],
            anexoFile: null,
            progressUpload: 0,
            imagesComentarios:[],
            enviaComentarioFlag:true
        };
        this.analistaImagem = "";
        this.adicionar = this.adicionar.bind(this);
        this.verificaAnalista = this.verificaAnalista.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setComentarios =this.setComentarios.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.downloadAnexo = this.downloadAnexo.bind(this);
        this.atualizaListAnexo = this.atualizaListAnexo.bind(this);
        this.deleteAnexo = this.deleteAnexo.bind(this);
        this.desvincularAnalista = this.desvincularAnalista.bind(this);
        this.mapsSelector2 = this.mapsSelector2.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.loadImages = this.loadImages.bind(this);


        if(usuario == null){
            this.usuario = null;
        } else {
            this.usuario = user.perfilAcesso;
        }

    }
    componentDidMount(){
        this.refresh();
    }

    atualizaListAnexo(){
        var config = {
            headers: {
                Authorization: this.token
            }
        };
        const idAtividade = this.atividadeId;

        axios.get(`${URL}anexo/analista/list/${idAtividade}`, config).then(resp => this.setState(
            {
                ...this.state,
                anexo: resp.data.response
            }
            )
        )
    }

    refresh(){
        const id = sessionStorage.getItem('idAtividade', id);
        const idAtividade = this.atividadeId;
        this.atividadeId = id
        var config = {headers:{Authorization:this.token}};
        axios.get(`${URL}atividade/analista/detalhe/${id}`,config)
            .then(resp => this.setState(...this.state,{atividade:resp.data.response,
                alocados:resp.data.response.historicoAlocacao,
                comentarios:resp.data.response.comentarios, 
                esforco: resp.data.response.horarioTrabalho}))
            .then(resp=> this.formataData(this.state.atividade.dataEntrega))
            .then(resp => this.atualizaListAnexo())
            .then(res => {if(this.state.enviaComentarioFlag){ this.loadImages()}})
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

    btn_detalheAnalista(id){
        sessionStorage.setItem('idAnalista',id)
        this.props.history.push("/detalheAnalista");
    }

    onSelect = (v) => {
        for (let i=0; i<this.state.analistas.length; i++){
            if( v === this.state.analistas[i].nome){
                this.setState({usuario:{id:this.state.analistas[i].id}})
            }
        }
    }

    adicionarDepoisDeVeirificar(){
        const json = {atividade:{id:this.state.atividade.id},usuario:this.state.usuario}
        var config = {headers:{Authorization:this.token}};
        axios.post(`${URL}historicoAlocacao/gestor/vincular`,json,config)
            .then(resp => this.verificaAnalista(resp.data))
            .then(resp=> this.setState({value:""}))
            .then(resp=> this.closeModal('modal'))
            .catch(error=> toast.error('Erro no servidor!',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))

    }

    verificaAnalista(dados){
        if(dados.statusCode ==='200'){
            toast.success('Usuario Vinculado sucesso!',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            })
            this.refresh()
        }
        else {
            toast.warn('Usuário já Vinculado',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            })
        }
    }

    verificaConflito(data){
        if(data.statusCode === '401'){
            this.setState({
                ['modal']: true
            });
        }
        else{
            const json = {atividade:{id:this.state.atividade.id},usuario:this.state.usuario}
            var config = {headers:{Authorization:this.token}};
            axios.post(`${URL}historicoAlocacao/gestor/vincular`,json,config)
                .then(resp => this.verificaAnalista(resp.data))
                .then(resp=> this.setState({value:""}))
                .catch(error=> toast.error('Erro no servidor!',{
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                }))
        }
    }

    closeModal(tabId){
        this.setState({
            [tabId]: false
        });
    }

    adicionar(){
        const json = {atividade:{id:this.state.atividade.id},usuario:this.state.usuario}
        var config = {headers:{Authorization:this.token}};
        axios.post(`${URL}historicoAlocacao/gestor/conflito`,json,config)
            .then(resp=> this.verificaConflito(resp.data))
    }

    enviarComentario(){
        var config = {headers:{Authorization:this.token}};
        const json = {comentario:this.state.comentario,atividade:{id:this.atividadeId}};
        this.setState({enviaComentarioFlag:false});
        axios.post(`${URL}comentario/analista/cadastrar`,json,config)
            .then(resp=> this.refresh())
            .then(resp=> this.setState({comentario:''}))
            .then(resp=> toast.success('Mensagem enviada',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))
            .then(resp=> $('#scrollbarComentario').animate({scrollTop: $('#scrollbarComentario').prop("scrollHeight")}, 500))
            .catch(error => toast.error('Mensagem não pode ser enviada!',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))

    }

    setComentarios(event){
        this.setState({comentario:event.target.value})
    }

    onChange = (value) => {
        this.setState({value,});
        if (value !== " ") {
            var config = {headers:{Authorization:this.token}};
            axios.get(`${URL}usuario/gestor/pesquisar/${this.state.value}`,config)
                .then(resp=> this.setState({analistas:resp.data.response}))
        }
    }

    mapsSelector() {
        const endereco=  this.state.atividade.endereco
        const numero = this.state.atividade.enderecoNumero
        if
        ((navigator.platform.indexOf("iPhone") !== -1) ||
            (navigator.platform.indexOf("iPod") !== -1) ||
            (navigator.platform.indexOf("iPad") !== -1)){
            window.open("maps://maps.google.com/maps?daddr=" +endereco + numero);
        } else {/* else use Google */
            window.open("https://maps.google.com/maps?daddr="+ endereco + numero);
        }
    }

    formataData(data) {
        let dataFormatada = data.split("-");
        let novaData = dataFormatada[2]+"/"+dataFormatada[1]+"/"+dataFormatada[0]
        this.setState({
            dataEntrega: novaData})
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
        anexo = {...anexo, atividade:{id: this.atividadeId}}
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
            formData.append('idAtividade', this.atividadeId);
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

    desvincularAnalista(idUser){
        var config = {
            headers: {
                Authorization: this.token
            }
        };
        let json = {
            atividade:{id:this.state.atividade.id},
            usuario:{id:idUser}
        }

        axios.post(`${URL}historicoAlocacao/gestor/desvincular`,json,config)
            .then(resp => this.refresh())
            .then(resp => toast.success('Usuario removido com sucesso!',
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                }));
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

    mapsSelector2(latitude,longitude) {
        if ((navigator.platform.indexOf("iPhone") !== -1) ||
            (navigator.platform.indexOf("iPod") !== -1) ||
            (navigator.platform.indexOf("iPad") !== -1)) {
            window.open("maps://maps.google.com/maps?q=" +latitude + "," + longitude);
        } else {/* else use Google */
            window.open("https://maps.google.com/maps?q="+ latitude +"," + longitude);
        }
    }

    goAtividade(){
        sessionStorage.setItem('idProjeto',this.state.atividade.projeto.id);
        this.props.history.push('/detalheProjeto')
    }

    keyHandler(e) {
        if (e.key === 'Enter') {
            this.enviarComentario()
        }
    }

    getImage(nameFile) {
        console.log(nameFile)
        var config = {
            headers: {
                Authorization: this.token
            }
        };

        axios.get(`${URL}usuario/analista/getimage/${nameFile}`, config)
            .then(resp => this.analistaImagem = resp.data["response"]);
    }

    render(){
        const trabalho = ()=>{
            return this.state.esforco.map(trabalho => {

                return (<tr key={trabalho.id}>
                    <td>{trabalho.usuario.nome} {trabalho.usuario.sobreNome}</td>
                    <td className="curso-pointer link-style" onClick={() => this.mapsSelector2(trabalho.latitude, trabalho.longitude)}><i className="fa fa-location-arrow"/> Local</td>
                    <td>{trabalho.dataInicio}</td>
                    <td>{trabalho.dataFim === null ? "Em andamento" : trabalho.dataFim}</td>
                    <td>{trabalho.totalHoras}</td>
                </tr>)

            })
        }

        const listaAnexo = () => {
            let list = this.state.anexo || [];
            return list.map(anexo => (
                <tr key={anexo.id}>
                    <td className="link-style" onClick={()=> {this.downloadAnexo((anexo.localArmazenamento + anexo.nomeAquivo))}} >{anexo.nomeAquivo}</td>
                    <td>{anexo.tamanho} Kbps</td>
                    <td>{anexo.usuario.nome} {anexo.usuario.sobreNome}</td>
                    <td>
                        <button style={{"marginLeft":"12px"}} className="btn btn-outline-danger" onClick={() => this.deleteAnexo(anexo)}>Remover</button>
                    </td>
                </tr>
            ))
        }

        if(this.usuario == null || this.usuario === "analista"){
            return (
                <Redirect to ="/"/>
            );
        }
        const analistas = this.state.analistas;
        let options;
        options = analistas.map((a) => {
            return <Option key={a.id,a.nome}> <i>{a.nome} - {a.email} - {a.cidade}</i></Option>;
        })

        return (
            <div>
                <br/>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboardAdmin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        <Link to="/listarProjetos">Listar Projetos</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        <a href="#" onClick={this.goAtividade.bind(this)}>Atividades</a>
                    </li>
                    <li className="breadcrumb-item active">Detalhar atividade</li>
                </ol>

                <div className="container-fluid mb-3">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="home-tab" data-toggle="tab" href="#detail" role="tab" aria-controls="home" aria-selected="true">Detalhes</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="members-tab" data-toggle="tab" href="#members" role="tab" aria-controls="profile" aria-selected="false">Analistas</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="comentarios-tab" data-toggle="tab" href="#comentarios" role="tab" aria-controls="comentarios" aria-selected="false">Comentários</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="anexos-tab" data-toggle="tab" href="#anexos" role="tab" aria-controls="anexos" aria-selected="false">Anexos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="esforco-tab" data-toggle="tab" href="#esforco" role="tab" aria-controls="esforco" aria-selected="false">Esforço</a>
                        </li>
                    </ul>

                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="detail" role="tabpanel" aria-labelledby="home-tab">
                            <div className="atividade-projeto">
                                <h3 className="inline-projeto">{this.state.atividade.nome}</h3>
                                <i className="inline-projeto color-p-projeto"> - {this.state.dataEntrega}
                                </i> <i className="color-p-projeto">({this.state.atividade.status})</i>
                                <div>
                                    <ReactStars
                                        count={5}
                                        value={this.state.atividade.complexidade}
                                        size={22}
                                        edit={false}
                                        color2={'#ffd700'} />
                                </div>

                                <p className="descript">
                                    {this.state.atividade.descricao}
                                </p>
                                {this.state.atividade.endereco !== ''?
                                    <div className="location-margin">
                                        <li className="list-inline-item link-style">
                                            <i className="fa fa-location-arrow" aria-hidden="true"/> 
                                            <a className="atividade-localizacao"
                                               onClick={this.mapsSelector.bind(this)}>

                                                {(this.state.atividade.endereco !== ""|| null ?this.state.atividade.endereco:'')}
                                                {(this.state.atividade.enderecoNumero !== "" || null ? ', '+ this.state.atividade.enderecoNumero:'')}
                                                {(this.state.atividade.cidade !== "" || null ?' - '+this.state.atividade.cidade:'')}
                                                {(this.state.atividade.uf !== "" || null ? "/"+this.state.atividade.uf:'')}
                                                {(this.state.atividade.cep !== "" ||null ? " - "+this.state.atividade.cep:'')}
                                            </a>

                                         
                                        </li>
                                    </div> : ""}
                            </div>
                        </div>

                        <div className="tab-pane fade" id="comentarios" role="tabpanel" aria-labelledby="comentarios-tab">
                            <div className="pt-3">
                                <div className="row">
                                    <div className="text-center mb-3 col-md-8 ">

                                        <div id="scrollbarComentario" className="scrollbar scrollbar-primary" style={{'width':'100%'}}>
                                            <div className="container">
                                                <ListaComentariosGestor comentarios={this.state.comentarios}/>
                                            </div>
                                        </div>

                                        <div className="text-comentario p-2 row m-auto">
                                            <div className="col-md-9 col-sm-8">
                                                <Input type="textarea" onChange={this.setComentarios} value={this.state.comentario} onKeyUp={this.keyHandler} name="text" id="inputComentario" />
                                            </div>
                                            <div className="col-md-3 p-3 col-sm-4">
                                                <Button className="btn btn-success btn-round" onClick={this.enviarComentario.bind(this)}>Enviar</Button>
                                            </div>
                                        </div>



                                    </div>
                                    <div className="d-none d-md-inline-block vl"></div>

                                    <div className="col-md-3 p-3">
                                        <h5 style={{'marginLeft':'10px'}}>Colaboradores</h5>
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


                        <div className="tab-pane fade atividade-projeto" id="members" role="tabpanel" aria-labelledby="members-tab">
                            <div className="row">
                                <div className="col-md-6">
                                    <Select
                                        style={{width:'100%','marginTop':'10px'}}
                                        onChange={this.onChange}
                                        onSelect={this.onSelect}
                                        notFoundContent="Não encontrado"
                                        allowClear
                                        placeholder="Buscar Analista por nome, cpf ou cnpj"
                                        value={this.state.value}
                                        combobox
                                        backfill
                                        filterOption={true}>
                                        {options}
                                    </Select>
                                </div>
                                <div className="col-md-2">
                                    <button type="button" onClick={this.adicionar} className="btn btn-primary btn-round mt-2 full-width">Adicionar</button>
                                </div>
                            </div>
                            <div className="row members-margin center-div">
                                {
                                    this.state.alocados.map(function(analista){
                                        return(
                                            <div key={analista.usuario.id}  className="card no-margin c-analista m-2" >
                                                <div className="float-right">
                                                    <span className="close desvincularAnalista" onClick={() => this.desvincularAnalista(analista.usuario.id)} aria-hidden="true">&times;</span>
                                                </div>
                                                <div  className="card-body card-properties curso-pointer" onClick={this.btn_detalheAnalista.bind(this,analista.usuario.id)}>
                                                    <h5 className="card-title">{analista.usuario.nome} {analista.usuario.sobreNome}</h5>
                                                    <p className="card-text">
                                                        <li> {analista.usuario.celular} </li>
                                                        <li> {analista.usuario.telefone} </li>
                                                    </p>
                                                </div>

                                                <div className="card-footer">
                                                    <div className="text-muted">{analista.usuario.cidade}-{analista.usuario.uf}</div>

                                                </div>
                                            </div>
                                        );
                                    }.bind(this))
                                }
                            </div>
                        </div>

                        <div className="tab-pane fade" id="anexos" role="tabpanel" aria-labelledby="anexos-tab">
                            <div className="row">
                                <div className="col-md-12 atividade-projeto">
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
                                    <div className="table-responsive-md">
                                        <table className="table m-3">
                                            <thead>
                                            <tr>
                                                <th scope="col">Nome Arquivo</th>
                                                <th scope="col">Tamanho</th>
                                                <th scope="col">Usuário</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {listaAnexo()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tab-pane fade atividade-projeto" id="esforco" role="tabpanel" aria-labelledby="esforco-tab">
                            <div>
                                <table className="table table-striped" style={{"fontSize": "12px", "marginTop": "10px"}}>
                                    <thead>
                                    <tr>
                                        <th scope="col">Analista</th>
                                        <th scope="col">Local</th>
                                        <th scope="col">Inicio</th>
                                        <th scope="col">Fim</th>
                                        <th scope="col">Horas</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {trabalho()}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={this.state.modal} toggle={this.closeModal.bind(this, 'modal')} className={this.props.className}>
                        <ModalHeader toggle={this.closeModal.bind(this, 'modal')}>Usuário já possui atividade nesse período</ModalHeader>
                        <ModalBody>
                            Deseja adicionar mesmo assim ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="btn btn-default mt-2" onClick={this.closeModal.bind(this, 'modal')}>Cancelar</Button>
                            <Button color="btn btn-primary float-right mt-2" onClick={this.adicionarDepoisDeVeirificar.bind(this)}>Adicionar</Button>
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
                    <ToastContainer />
                </div>
            </div>
        );
    }
}
