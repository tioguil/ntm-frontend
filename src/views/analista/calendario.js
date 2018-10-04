import React, { Component } from 'react';
import {Redirect,Link } from 'react-router-dom';


export default class Calendario extends Component {
  constructor(){
    super();
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
    if(this.usuario == null || this.usuario === "gestor"){
      return (
         <Redirect to ="/"/>
        );
      }
    return (
      <div>
              <br/>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/calendario">Calendário</Link>
                    </li>
                  </ol>

                  <h1>Calendário</h1>
                  <hr/>
                  <table className="table table-bordered table-style table-display">
                    <tr>
                      <th colSpan="2"><a><span className="glyphicon glyphicon-chevron-left"></span></a></th>
                      <th colSpan="3"> Jan - 2018 </th>
                      <th colSpan="2"><a> > <span className="glyphicon glyphicon-chevron-right"></span></a></th>
                    </tr>
                    <tr>
                      <th>S</th>
                      <th>M</th>
                      <th>T</th>
                      <th>W</th>
                      <th>T</th>
                      <th>F</th>
                      <th>S</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td>7</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>9</td>
                      <td>10</td>
                      <td>11</td>
                      <td className="today">12</td>
                      <td>13</td>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>15</td>
                      <td>16</td>
                      <td>17</td>
                      <td>18</td>
                      <td>19</td>
                      <td>20</td>
                      <td>21</td>
                    </tr>
                    <tr>
                      <td>22</td>
                      <td>23</td>
                      <td>24</td>
                      <td>25</td>
                      <td>26</td>
                      <td>27</td>
                      <td>28</td>
                    </tr>
                    <tr>
                      <td>29</td>
                      <td>30</td>
                      <td>31</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </table>
      </div>
    );
  }
}
