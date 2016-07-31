import React from 'react';


export default class Header extends React.Component {

	showOverlay() {
		console.log("show help overlay");
	}

	render() {
		return (
			<header>
				<div className="inner">
					<img src="/i/lightwtf.svg" className="logo" title="light.wtf icon"/>
	                <h1 className="site-title">
				  		{this.props.title}
					</h1>
					<div className="help" onClick={this.showOverlay}>?</div>
	            </div>
        	</header>
		);
  	}
};


