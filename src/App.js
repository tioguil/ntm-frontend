import React from 'react';
import 'jquery';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/_all-skins.min.css';
import 'admin-lte/plugins/iCheck/flat/blue.css';
import 'admin-lte';
import 'admin-lte/plugins/jQueryUI/jquery-ui';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Footer from './components/footer';

export default props => (
  <div id="page-top">
    <Navbar/>

    <div id="wrapper">
      <Sidebar/>
      <div id="content-wrapper">
        <div className="container-fluid">
          {props.children}
        </div>
        <Footer/>
      </div>
    </div>
  </div>
);