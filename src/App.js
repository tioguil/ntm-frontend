import React, { Component } from 'react';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar'
import Footer from './components/footer'
export default props => (
		<div className="wrapper">
		<Navbar/>
		<div className="row">
			<div className="col-2.5">
				<Sidebar/>
			</div>
			
				<div className="col content-wrapper">
					{props.children}
				</div>
				<Footer/>
			</div>

		</div>
	)