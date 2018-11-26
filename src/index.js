import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';



// window.tipo_usuario = 1;
// ReactDOM.render(<NavbarTemplate/>, document.getElementById('navbar'));
// ReactDOM.render(<SidebarTemplate/>, document.getElementById('sidebar'));
// ReactDOM.render(<FooterTemplate/>, document.getElementById('footer'));
ReactDOM.render(<Routes/>, document.getElementById('root'));

// registerServiceWorker();
