import React, { Component } from 'react';
import axios from 'axios';
import {URL,CEP} from '../global';
import {Helmet} from 'react-helmet';
import InputMask from 'react-input-mask';
import {Input} from 'reactstrap';

export default class Cadastro extends Component {
    constructor(props){
        super(props);
        this.state = {
            nome:"",
            sobreNome:"",
            email:"",
            cpfCnpj:"",
            rg:"",
            senha:"",
            senha2:"",
            endereco:"",
            enderecoNumero:"",
            complemento:"",
            cep:"",
            cidade:"",
            uf:"",
            telefone:"",
            celular:"",
            perfilAcesso:"analista"
        };
    }

    setNome(event){this.setState({nome:event.target.value})}
    setSobreNome(event){this.setState({sobreNome:event.target.value})}
    setEmail(event){this.setState({email:event.target.value})}
    setCpf(event){this.setState({cpfCnpj:event.target.value})}
    setRg(event){this.setState({rg:event.target.value})}
    setSenha(event){this.setState({senha:event.target.value})}
    setSenha2(event){this.setState({senha2:event.target.value})
        document.getElementById('inputPassword2').classList.remove('warn-input')
    }
    setEndereco(event){this.setState({endereco:event.target.value})}
    setEnderecoNumero(event){this.setState({enderecoNumero:event.target.value})}
    setComplemento(event){this.setState({complemento:event.target.value})}
    setCep(event){
        this.setState({cep:event.target.value})
        if(!event.target.value.endsWith('_')){
        axios.get(`${CEP}${event.target.value}/json/`)
            .then(resp=> {this.state, this.setState({endereco:resp.data.logradouro,uf:resp.data.uf,cidade:resp.data.localidade})})
    }}
    setCidade(event){this.setState({cidade:event.target.value})}
    setUf(event){this.setState({uf:event.target.value})}
    setTelefone(event){this.setState({telefone:event.target.value})}
    setCelular(event){this.setState({celular:event.target.value})}

    cadastrar(event){
        event.preventDefault();
        var parans = new URLSearchParams(this.props.location.search);
        let token = parans.get("token");

        if(this.state.senha2!==this.state.senha || this.state.senha === "" ){
            document.getElementById('inputPassword2').classList.add('warn-input')
        }
        else if (this.state.senha2===this.state.senha){
            document.getElementById('inputPassword2').classList.remove('warn-input')
            axios.post(`${URL}usuario/cadastrar/invite/${token}`,this.state)
                .then(resp=> this.conflitos(resp))
        }
    }

    conflitos(resp){
        if(resp.data.statusCode=="400"){
            this.setState({token:true}) 
        }
        else{
           this.props.history.push("/msg") 
        }
        
    }
    render(){
        const errorMessage = (
          this.state.token?
            <div className="alert alert-danger" role="alert">
              Convite já utilizado ou token expirado!
            </div>
          : null
        );
        return(
            <div className="container">
                <Helmet>
                    <style>{"html, body {height: 100% !important; } body {background-color: #f0f2f4; align-items: center !important; } #root {width: 100%;}"}</style>
                    <style>{".card-signin {border: 0; border-radius: 1rem; box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1); } .card-signin .card-title {margin-bottom: 2rem; font-weight: 300; font-size: 1.5rem; } .card-signin .card-body {padding: 2rem; } .form-signin {width: 100%; } .form-signin .btn {font-size: 80%; border-radius: 5rem; letter-spacing: .1rem; font-weight: bold; padding: 1rem; transition: all 0.2s; } .form-label-group {position: relative; margin-bottom: 1rem; } .form-label-group input {border-radius: 2rem; } .form-label-group > input, .form-label-group > label {padding: .75rem 1.5rem; } .form-label-group > label {position: absolute; top: 0; left: 0; display: block; width: 100%; margin-bottom: 0; line-height: 1.5; color: #495057; border: 1px solid transparent; border-radius: .25rem; transition: all .1s ease-in-out; } .form-label-group input::-webkit-input-placeholder {color: transparent; } .form-label-group input:-ms-input-placeholder {color: transparent; } .form-label-group input::-ms-input-placeholder {color: transparent; } .form-label-group input::-moz-placeholder {color: transparent; } .form-label-group input::placeholder {color: transparent; } .form-label-group input:not(:placeholder-shown) {padding-top: calc(.75rem + .75rem * (2 / 3)); padding-bottom: calc(.75rem / 3); } .form-label-group input:not(:placeholder-shown)~label {padding-top: calc(.75rem / 3); padding-bottom: calc(.75rem / 3); font-size: 12px; color: #777; }"}</style>
                </Helmet>
                <div className="row">
                    <div className="col-sm-9 col-lg-9 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <div className="card-title text-center contact-image">
                                    <img src="img/logo.png" alt="Logo"/>
                                </div>
                                {errorMessage}
                                <div className="text-center" style={{'marginBottom':'10px'}}>
                                    <h2>Bem vindo ao NTM</h2>
                                    <i>(Preencha o formulário abaixo)</i>
                                </div>

                                <form className="form-signin">

                                    <div className="form-row">
                                        <div className="form-group form-label-group col-md-6">
                                            <input type="text" id="inputNome" className="form-control" value={this.state.nome} onChange={this.setNome.bind(this)} placeholder="Nome" required autofocus/>
                                            <label for="inputNome">Nome:</label>
                                        </div>

                                        <div className="form-group  form-label-group col-md-6">
                                            <input type="text" id="inputSobreNome" className="form-control" value={this.state.sobreNome} onChange={this.setSobreNome.bind(this)} placeholder="Sobrenome" required autofocus/>
                                            <label for="inputSobreNome">Sobrenome:</label>
                                        </div>
                                    </div>


                                    <div className="form-row">
                                        <div className="form-group  form-label-group col-md-6">
                                            <input type="email" id="inputEmail" className="form-control" value={this.state.email} onChange={this.setEmail.bind(this)} placeholder="Email" required autofocus/>
                                            <label for="inputEmail">E-mail:</label>
                                        </div>

                                        <div className="form-group  form-label-group col-md-3">
                                            <Input type="text" id="inputTel" className="form-control" value={this.state.telefone} onChange={this.setTelefone.bind(this)} placeholder="(99)9999-9999"  mask="(99) 9999-9999" tag={InputMask} required autofocus/>
                                            <label for="inputTel">Telefone:</label>
                                        </div>
                                        <div className="form-group  form-label-group col-md-3">
                                            <Input type="text" id="inputCel" className="form-control" value={this.state.celular} onChange={this.setCelular.bind(this)}  mask="(99) 99999-9999" tag={InputMask} placeholder="(99)9 9999-9999" required autofocus/>
                                            <label for="inputCel">Celular:</label>
                                        </div>
                                    </div>



                                    <div className="form-row">
                                        <div className="form-group form-label-group col-md-6">
                                            <Input type="text" id="inputCPF" value={this.state.cpfCnpj} onChange={this.setCpf.bind(this)} className="form-control" placeholder="999.999.999-99" mask="999.999.999-99" tag={InputMask} required/>
                                            <label for="inputCPF">CPF:</label>
                                        </div>

                                        <div className="form-group  form-label-group col-md-6">
                                            <Input type="text" id="inputRg" value={this.state.rg} onChange={this.setRg.bind(this)} className="form-control" placeholder="99.999.999-9"  mask="99.999.999-9" tag={InputMask}required/>
                                            <label for="inputRg">RG:</label>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group form-label-group col-md-6">
                                            <input type="password" id="inputPassword" value={this.state.senha} onChange={this.setSenha.bind(this)} className="form-control" placeholder="Senha" required/>
                                            <label for="inputPassword">Senha:</label>
                                        </div>

                                        <div className="form-group  form-label-group col-md-6">
                                            <input type="password" id="inputPassword2" value={this.state.senha2} onChange={this.setSenha2.bind(this)} className="form-control" placeholder="Senha" required/>
                                            <label for="inputPassword2">Confirma Senha:</label>
                                        </div>
                                    </div>
                                    <hr></hr>
                  
                                    <div className="form-row">
                                        <div className="form-group form-label-group col-md-9">
                                            <input type="text" id="inputEndereco" value={this.state.endereco} onChange={this.setEndereco.bind(this)} className="form-control" placeholder="Ex.:Rua/Av" required/>
                                            <label for="inputEndereco">Endereço:</label>
                                        </div>

                                        <div className="form-group  form-label-group col-md-3">
                                            <input type="text" id="inputNumero" value={this.state.enderecoNumero} onChange={this.setEnderecoNumero.bind(this)} className="form-control" placeholder="Ex:123" required/>
                                            <label for="inputNumero">Número:</label>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group  form-label-group col-md-3">
                                            <input type="text" id="inputComplemento" value={this.state.complemento} onChange={this.setComplemento.bind(this)} className="form-control" placeholder="Ex:Ap/Casa" required/>
                                            <label for="inputComplemento">Complemento:</label>
                                        </div>
                                        <div className="form-group  form-label-group col-md-3">
                                            <Input type="text" id="inputCEP" value={this.state.cep} onChange={this.setCep.bind(this)} className="form-control" placeholder="Ex:99999-999" mask="99999-999" tag={InputMask} required/>
                                            <label for="inputCEP">CEP:</label>
                                        </div>

                                        <div className="form-group form-label-group col-md-3">
                                            <div className="selectWrapper w-100">
                                                <select id="inputEstado" value={this.state.uf} onChange={this.setUf.bind(this)} className="selectBox w-100">
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
                                        <div className="form-group form-label-group col-md-3">
                                            <input type="text" id="inputCidade" value={this.state.cidade} onChange={this.setCidade.bind(this)} className="form-control" placeholder="Ex:São Paulo" required/>
                                            <label for="inputCidade">Cidade:</label>
                                        </div>
                                    </div>

                                    <button className="btn btn-lg btn-danger btn-red btn-block text-uppercase" onClick={this.cadastrar.bind(this)} type="submit">Cadastrar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
