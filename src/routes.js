import React, { Component } from 'react';
import {Route,Router,Switch} from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import App from './App';
import Login from "./views/login";
import Cadastro from "./views/cadastro";
import TelaMensagem from "./views/telaMensagem";
import EsqueceuSenha from './views/esqueceuSenha';
import ListarAnalistas from "./views/gestor/listarAnalistas";
import ListarProjetos from "./views/gestor/listarProjetos";
import CadastrarAnalista from './views/gestor/cadastrarAnalista';
import CadastrarProjeto from './views/gestor/cadastrarProjeto';
import DetalheAnalista from './views/gestor/detalheAnalista';
import DetalheProjeto from './views/gestor/detalheProjeto';
import DashboardAdmin from "./views/gestor/dashboardAdmin";
import Dashboard from "./views/analista/dashboard";
import DetalheAtividade from "./views/analista/detalheAtividade";
import Atividades from './views/gestor/atividades';
import Calendario from './views/analista/calendario';
import EditarPerfil from './views/editarPerfil';

const history = createHistory();

export default class Routes extends Component{
	constructor(props){
		super(props);
		this.state = {
			renderPage: 0
		};
		var usuario = localStorage.getItem('user');
		const user = JSON.parse(usuario);
		this.usuario = user
   
		if(usuario == null){
			this.usuario = null
		}
		else{
			this.usuario = user.perfilAcesso
		}

		this.renderPage = this.renderPage.bind(this);
	}

	renderPage(){
		this.setState({renderPage: this.state.renderPage + 1})
	}
	render(){
		return (
			<Router history={history}>
				<Switch>
					<Route exact path="/" component={Login}/>
					<Route path="/esqueceuSenha" component={EsqueceuSenha}/>
					<Route exact path="/cadastro" component={Cadastro}/>
					<Route exact path="/msg" component={TelaMensagem}/>
					<App>	
						<Switch>
							<Route exact path="/DashboardAdmin" component={DashboardAdmin}/>
							<Route  path="/listarAnalistas" component={ListarAnalistas}/>
							<Route  path="/cadastrarAnalista" component={CadastrarAnalista}/>
							<Route  path="/cadastrarProjeto" component={CadastrarProjeto}/>
							<Route  path="/detalheAnalista" component={DetalheAnalista}/>
							<Route  path="/listarProjetos" component={ListarProjetos}/>
							<Route  path="/detalheProjeto" component={DetalheProjeto}/>
							<Route  path="/atividades" component={Atividades}/>
							<Route path="/editarPerfil" component={EditarPerfil}/>
								
							<Route path="/Dashboard" component={Dashboard}/>
							<Route path="/calendario" component={Calendario}/>
							<Route path="/DetalheAtividade" component={DetalheAtividade}/>
						</Switch>
					</App>
						
				</Switch>
			</Router>
		)
	}
}	
