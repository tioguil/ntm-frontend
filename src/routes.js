import React, { Component } from 'react';
import {Route,Redirect,Router,Switch,hashHistory} from 'react-router-dom'
import createHistory from "history/createBrowserHistory"
import App from './App'
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
	
import EditarPerfil from './views/editarPerfil'

const history = createHistory();

export default class Routes extends Component{
	constructor(props){
    super(props);
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user
   
    if(usuario == null){
      this.usuario = null
    }
    else{
      this.usuario = user.perfilAcesso
    }  
  }
    render(){
			return (
				<Router history={history}>
					<Switch>
						<Route exact path="/" component={Login}/>
						<Route path="/esqueceuSenha" component={EsqueceuSenha}/>
						<Route path="/editarPerfil" component={EditarPerfil}/>
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

								
									<Route path="/Dashboard" component={Dashboard}/>
									<Route path="/calendario" component={Calendario}/>
									<Route path="/DetalheAtividade" component={DetalheAtividade}/>
									<Route path="/visualizarComentarios" component={VisualizarComentarios}/>
								</Switch>
							</App>
						
						</Switch>
				</Router>
				)
	}
}	
