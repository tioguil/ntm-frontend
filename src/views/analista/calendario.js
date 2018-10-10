import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import BigCalendar from "react-big-calendar";
import * as moment from 'moment';
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
const eventos = [
  {
    'title': 'Criar Menu',
    'start': new Date(2018, 9, 15, 19, 30, 0),
    'end': new Date(2018, 9, 19, 2, 0, 0)
  }
]

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
                    <button type="button" onClick={this.navigate.bind(null, navigate.NEXT)}><i class="fas fa-arrow-right"></i></button>
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

    this.usuario = usuario == null ? null : user.perfilAcesso;
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
          events={eventos}
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