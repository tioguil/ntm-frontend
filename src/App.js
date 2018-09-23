import React, { Component } from 'react';
import {
	BrowserRouter,
	Route,
	Switch,
	browserHistory} from 'react-router-dom';
import {Redirect } from 'react-router-dom';
import Login from "./views/login";
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
import VisualizarComentarios from "./views/analista/visualizarComentarios";
import Atividades from './views/gestor/atividades';
import Calendario from './views/analista/calendario';



const URL = 'http://localhost:8080/'


class App extends Component {
	
	render(){
			return(
			<div>
					<BrowserRouter >
							<Switch>
								<Route exact path="/" component={Login}/>
								<Route exact path="/esqueceuSenha" component={EsqueceuSenha}/>

								<Route exact path="/DashboardAdmin" component={DashboardAdmin}/>
								<Route exact path="/listarAnalistas" component={ListarAnalistas}/>
								
								<Route exact path="/cadastrarAnalista" component={CadastrarAnalista}/>
								<Route exact path="/cadastrarProjeto" component={CadastrarProjeto}/>
								<Route exact path="/detalheAnalista" component={DetalheAnalista}/>
								
								<Route exact path="/listarProjetos" component={ListarProjetos}/>
								<Route exact path="/detalheProjeto" component={DetalheProjeto}/>
								<Route exact path="/atividades" component={Atividades}/>
								


								<Route exact path="/Dashboard" component={Dashboard}/>
								<Route exact path="/calendario" component={Calendario}/>
								<Route path="/DetalheAtividade" component={DetalheAtividade}/>
								<Route path="/visualizarComentarios" component={VisualizarComentarios}/>



							</Switch>
					</BrowserRouter>
				</div>
			);
	}
}

export default App;
