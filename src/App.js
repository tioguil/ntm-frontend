import React from 'react';
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.min.css'
import 'admin-lte/plugins/iCheck/flat/blue.css'
import 'jquery'
import 'fastclick'
import 'admin-lte'
import 'admin-lte/plugins/jQueryUI/jquery-ui'
import Navbar from './components/navbar';
import Sidebar from './components/sidebar'
import Footer from './components/footer'
export default props => (
		
	<div>
		<Navbar/>

			<div className="position">
				<Sidebar/>
			</div>

			<div className="content-wrapper">
				{props.children}
				<Footer/>
			</div>
		
		
		
	</div>	
	)