import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import BigCalendar from "react-big-calendar";
import * as moment from 'moment';
import axios from 'axios';
import {URL} from '../../global'
import 'moment/locale/pt-br';
import "react-big-calendar/lib/css/react-big-calendar.css";

export let navigate = {
    PREVIOUS: 'PREV',
    NEXT: 'NEXT',
    TODAY: 'TODAY',
    DATE: 'DATE',
}

moment.locale('pt-BR');
const localizer = BigCalendar.momentLocalizer(moment);

class CustomToolbar extends React.Component {
    render() {
        let { localizer: { messages }, label } = this.props
        return(
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={this.navigate.bind(null, navigate.PREVIOUS)}><i className="fas fa-arrow-left"></i></button>
                </span>
                <span className="rbc-toolbar-label">{label}</span>
                <span className="rbc-btn-group">
                    <button type="button" onClick={this.navigate.bind(null, navigate.NEXT)}><i className="fas fa-arrow-right"></i></button>
                </span>
            </div>
        )
    }
    navigate = action => {
        this.props.onNavigate(action)
    }
}

export default class Calendario extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user;
    this.token = user.token.numero;
    this.state={atividades:[]}
    this.eventos = []
    this.usuario = usuario == null ? null : user.perfilAcesso;
    this.listarCalendario = this.listarCalendario.bind(this);

  }

  componentDidMount(){
    var config = {headers:{Authorization:this.token}};
    axios.get(`${URL}atividade/analista/lista`,config)
        .then(resp=> this.setState(...this.state,{atividades:resp.data.response.atividades}))
        .then(resp=>this.listarCalendario())
  }

  listarCalendario(){
    for(let i =0; i<this.state.atividades.length;i++){ 
      const [yearStart,monthStart,dayStart]=(this.state.atividades[i].dataEntrega).split("-")
      const [yearFinal,monthFinal,dayFinal]=(this.state.atividades[i].dataCriacao).split("-")

      console.log(new Date(yearFinal, monthFinal-1, dayFinal.substring(0,2), 10, 0, 0))

      this.eventos.push({
        'id':this.state.atividades[i].id,
        'title':this.state.atividades[i].nome,
        'start': new Date(yearStart, monthStart-1, dayStart, 5, 0, 0),
        'end': new Date(yearFinal, monthFinal-1, dayFinal.substring(0,2), 22, 0, 0)
      })
    }
  }

  render(){
    if (this.usuario == null || this.usuario === "gestor") {
      return (
        <Redirect to="/"/>
      );
    } 
    return (
      <div>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/calendario">Calendário</Link>
          </li>
        </ol>
        
        <h1>Calendário</h1>
        <hr/>
        <BigCalendar
          style={{ height: 500 }}
          events={this.eventos}
          localizer={localizer}
          // components={{
          //   toolbar: CustomToolbar
          // }}
          startAccessor='start'
          endAccessor='end'
        />
      </div>
    );
  }
}