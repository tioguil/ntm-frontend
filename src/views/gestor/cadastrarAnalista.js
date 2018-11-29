import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'rc-select/assets/index.css';
import Select, {Option} from 'rc-select';
import { Input } from 'reactstrap';
import axios from 'axios';
import {Redirect,Link} from 'react-router-dom';
import {URL,CEP} from '../../global';
import InputMask from 'react-input-mask';

export default class CadastrarAnalista extends Component {
  
    constructor(){
        super();
        var usuario = localStorage.getItem('user');
        const user = JSON.parse(usuario);
        this.token = user.token.numero
        this.state = {cargos: [],value: "",nome:"", senha:"",sobreNome:"",cpfCnpj:"",rg:"",email:"",telefone:"", celular:"",
            cargo:{id:0},endereco:"",enderecoNumero:"",complemento:"",cep:"",cidade:"",uf:"",observacao:"", perfilAcesso:"analista"}
        this.cadastrarAnalista = this.cadastrarAnalista.bind(this)
        if(usuario == null){
            this.usuario = null
        }

        else{
            this.usuario = user.perfilAcesso
        }


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



    enviarConvite(){

        var config = {headers:{Authorization:this.token}};
        var json={
            nivelAcesso:"analista",
            email:this.state.email,
            cargo:this.state.cargo.id
        };

        axios.post(`${URL}convite/gestor/convidar`,json,config)
            .then(resp => toast.success('Convite enviado com sucesso!',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))
            .catch( error => toast.error(error.message,{
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }));

        this.setState(...this.state, {nome:"", senha:"",sobreNome:"",cpfCnpj:"",rg:"",email:"",telefone:"",celular:"",
            value:"",endereco:"",enderecoNumero:"",complemento:"",cep:"",cidade:"",uf:"",observacao:"",perfilAcesso:""})
    }

    cadastrarAnalista(){
        var config = {headers:{Authorization:this.token}};
        axios.post(`${URL}usuario/gestor/cadastrar`,this.state,config)
            .then(toast.success('Analista cadastrado com sucesso!',{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }))
        this.setState(...this.state, {nome:"", senha:"",sobreNome:"",cpfCnpj:"",rg:"",email:"",telefone:"",celular:"",
            value:"",endereco:"",enderecoNumero:"",complemento:"",cep:"",cidade:"",uf:"",observacao:"",perfilAcesso:""})
    }

    onChange = (value) => {
        this.setState({value,});
        if (value !== " ") {
            var config = {headers:{Authorization:this.token}};
            axios.get(`${URL}cargo/gestor/pesquisar/${this.state.value}`,config)
                .then(resp=> this.setState(...this.state,{cargos:resp.data.response}))
        }
    }

    onSelect = (v) => {
        for (let i=0; i<this.state.cargos.length; i++){
            if( v === this.state.cargos[i].cargo){
                this.setState({cargo:{id:this.state.cargos[i].id}})
            }
        }
    }

    toggleDisabled = () => {
        this.setState({disabled: !this.state.disabled,});
    }

    render(){
        if(this.usuario == null || this.usuario === "analista"){
            return (
                <Redirect to ="/"/>
            );
        }
        const cargos = this.state.cargos;
        let options;
        options = cargos.map((c) => {
            return <Option key={c.cargo}> <i>{c.cargo}</i></Option>;
        });

        return (
            <div>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/dashboardAdmin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Cadastrar Analistas</li>
                </ol>

                <h3>Cadastrar Analistas</h3>
                <hr/>

                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-cadastra-tab" data-toggle="tab" href="#cadastrar" role="tab" aria-controls="nav-cadastra-tab" aria-selected="true">Cadastrar Analista</a>
                        <a class="nav-item nav-link" id="nav-convidar-tab" data-toggle="tab" href="#convidar" role="tab" aria-controls="nav-convidar-tab" aria-selected="false">Enviar Convite</a>
            
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="cadastrar" role="tabpanel" aria-labelledby="nav-cadastra-tab">
                        <div className="container-fluid mb-3">
                            <form style={{'marginTop': '3%'}}>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputNome" className="required">Nome:</label>
                                        <Input type="text" value={this.state.nome} onChange={this.dadosUsuario.bind(this,'nome')} className="form-control" id="inputNome" placeholder="Nome"/>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputSobrenome" className="required">Sobrenome:</label>
                                        <Input type="text" value={this.state.sobreNome} onChange={this.dadosUsuario.bind(this,'sobreNome')} className="form-control" id="inputSobrenome" placeholder="Sobrenome"/>
                                    </div>
                  
                                    <div className="form-group col-md-3">
                                        <label htmlFor="inputCpf" className="required"> CPF:</label>
                                        <Input type="text" value={this.state.cpfCnpj} onChange={this.dadosUsuario.bind(this,'cpfCnpj')} className="form-control" id="cpf" placeholder="xxx.xxx.xxx-xx" mask="999.999.999-99" tag={InputMask}/>
                                    </div>

                                    <div className="form-group col-md-3">
                                        <label htmlFor="inputRG" className="required">RG:</label>
                                        <Input type="text"  value={this.state.rg} onChange={this.dadosUsuario.bind(this,'rg')} className="form-control" id="rg" placeholder="xx.xxx.xxx-x" mask="99.999.999-*" tag={InputMask}/>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputCargo" className="required">Cargo:</label>
                                        <Select
                                            style={{width:'100%'}}
                                            onChange={this.onChange}
                                            onSelect={this.onSelect}
                                            notFoundContent="Não encontrado"
                                            allowClear
                                            placeholder="Ex.: Analista de Software"
                                            value={this.state.value}
                                            combobox
                                            backfill
                                            filterOption={false}>
                                            {options}
                                        </Select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label htmlFor="inputEmail" className="required">Email:</label>
                                        <Input type="text" className="form-control" value={this.state.email} onChange={this.dadosUsuario.bind(this,'email')} id="inputEmail" placeholder="Email"/>
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputTelefone">Telefone:</label>
                                        <Input type="text" className="form-control" value={this.state.telefone} onChange={this.dadosUsuario.bind(this,'telefone')} id="telefone" placeholder="(11) xxxx-xxxx" mask="(99) 9999-9999" tag={InputMask}/>
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputCelular" className="required">Celular</label>
                                        <Input type="text" className="form-control" value={this.state.celular} onChange={this.dadosUsuario.bind(this,'celular')} id="celular" placeholder="(11) xxxxx-xxxx" mask="(99) 99999-9999" tag={InputMask}/>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="inputEndereco">Endereço:</label>
                                        <Input type="text" className="form-control" value={this.state.endereco} onChange={this.dadosUsuario.bind(this,'endereco')} id="inputEndereco" placeholder="Rua/Av.:"/>
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputNumeroEndereco">Número:</label>
                                        <Input type="text" className="form-control" value={this.state.enderecoNumero} onChange={this.dadosUsuario.bind(this,'enderecoNumero')} id="inputNumeroEndereco" placeholder="123"/>
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputComplemento">Complemento:</label>
                                        <Input type="text" className="form-control" value={this.state.complemento} onChange={this.dadosUsuario.bind(this,'complemento')} id="inputComplemento" placeholder="Apto, Casa 2 ..."/>
                                    </div>

                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputCep" >CEP:</label>
                                        <Input type="text" className="form-control" value={this.state.cep} onChange={this.dadosUsuario.bind(this,'cep')} id="inputCep" placeholder="00000-000" mask="99999-999" tag={InputMask}/>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label htmlFor="inputCidade">Cidade:</label>
                                        <Input type="text" value={this.state.cidade} onChange={this.dadosUsuario.bind(this,'cidade')} className="form-control" id="inputCidade" placeholder="Cidade"/>
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="inputEstado"className="required">UF:</label>
                                        <select id="inputEstado" value={this.state.uf} onChange={this.dadosUsuario.bind(this,'uf')} className="form-control">
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
                                <button type="button" onClick={this.cadastrarAnalista} className="btn btn-success float-right mb-3 btn-round">Cadastrar</button>
                            </form>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="convidar" role="tabpanel" aria-labelledby="nav-convidar-tab">
                        <div style={{'marginTop': '5%'}}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label style={{'float':'left'}}htmlFor="inputEmail2" className="required">Email:</label>
                                    <Input type="text" className="form-control" value={this.state.email} onChange={this.dadosUsuario.bind(this,'email')} id="inputEmail2" placeholder="Email"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label style={{'float':'left'}} htmlFor="inputCargo1" className="required">Cargo:</label>
                                    <Select
                                        style={{width:'100%'}}
                                        onChange={this.onChange}
                                        onSelect={this.onSelect}
                                        notFoundContent="Não encontrado"
                                        allowClear
                                        placeholder="Ex.: Analista de Software"
                                        value={this.state.value}
                                        combobox
                                        backfill
                                        filterOption={false}>
                                        {options}
                                    </Select>
                                </div>

                            </div>
                
                            <button type="button" onClick={this.enviarConvite.bind(this)} className="btn btn-success float-right mb-3 btn-round">Convidar</button>
                        </div>
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
                {/* Same as */}
                <ToastContainer />
            </div>
        );
    }
}
