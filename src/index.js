import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'



// window.tipo_usuario = 1;
// ReactDOM.render(<NavbarTemplate/>, document.getElementById('navbar'));
// ReactDOM.render(<SidebarTemplate/>, document.getElementById('sidebar'));
// ReactDOM.render(<FooterTemplate/>, document.getElementById('footer'));
ReactDOM.render(<App/>, document.getElementById('root'));

// registerServiceWorker();
