import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import BigCalendar from "react-big-calendar";
import * as moment from 'moment';
import axios from 'axios';
import {URL} from '../../global';
import 'moment/locale/pt-br';
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale('pt-BR');
const localizer = BigCalendar.momentLocalizer(moment);

export default class Calendario extends Component {
  constructor(){
    super();
    var usuario = localStorage.getItem('user');
    const user = JSON.parse(usuario);
    this.usuario = user;
    this.token = user.token.numero;
    this.state = {atividades: []}
    this.eventos = []
    this.usuario = usuario == null ? null : user.perfilAcesso;
    this.listarCalendario = this.listarCalendario.bind(this);

  }

  componentWillMount(){
    this.carregarAtividades();
  }

  carregarAtividades(){
    var config = {
      headers: {
        Authorization:this.token
      }
    };

    axios.get(`${URL}atividade/analista/lista`, config)
      .then(resp => this.setState(
        ...this.state, {
          atividades: resp.data.response.atividades
        })
      )
      .then(resp => {
        this.listarCalendario();
        this.forceUpdate();
      });
  }

  listarCalendario(){
    if(this.state.atividades != null) {
        for (let i = 0; i < this.state.atividades.length; i++) {
            const [yearStart, monthStart, dayStart] = (this.state.atividades[i].dataCriacao).split("-")
            const [yearFinal, monthFinal, dayFinal] = (this.state.atividades[i].dataEntrega).split("-")
            this.eventos.push({
                'id': this.state.atividades[i].id,
                'title': this.state.atividades[i].nome,
                'start': new Date(yearStart, monthStart - 1, parseInt(dayStart.substring(0, 2)), 5, 0, 0),
                'end': new Date(yearFinal, monthFinal - 1, dayFinal, 22, 0, 0)
            })
        }
    }
  }

  mostrarDetalhes(idAtividade){
    sessionStorage.setItem('idAtividadeAnalista', idAtividade);
    this.props.history.push(`/DetalheAtividade`);
  }

  render(){
    const messages = {
          allDay: 'dia inteiro',
          previous: 'Voltar',
          next: 'Próximo',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'data',
          time: 'Tempo',
          showMore: (count) => `+${count} atividades`
    }
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
          messages={messages}
          style={{ height: 500 }}
          events={this.eventos}
          localizer={localizer}
          startAccessor='start'
          endAccessor='end'
          onClickWeekNumber={(weekNumber, date) => alert('Clicked week: ', weekNumber, 'that starts on: ', date)}
          returnValue="range"
          onSelectEvent={event => this.mostrarDetalhes(event.id)}
          popup='true'
        />
      </div>
    );
  }
}