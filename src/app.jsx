
// component.jsx
import React from 'react';
import ReactDOM from 'react-dom';

import Header from './header.jsx';
import Slider from 'react-rangeslider';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			iso: 2,
			aperture: 4
	    };
	}

	handleISOChange(value) {
    	this.setState({
			iso: value,
		});
    }

	handleApertureChange(value) {
    	this.setState({
			aperture: value,
		});
    }

	render() {
    	return (
			<div>
				<Header title="Exposure Calculator" />

				<div className="mt20">
                	<label>ISO: <span id="iso-val" className="val">{this.state.iso}</span></label>
					<Slider
				    	max={8}
						min={0}
						step={1}
						value={this.state.iso}
						onChange={this.handleISOChange.bind(this)}
					/>
				</div>


                <div className="mt20">
					<label> Aperture:
                        <span id="aperture-val" className="val">{this.state.aperture}</span>
                        <span id="aperture-overunder" className="overunder"></span>
                    </label>
                    <Slider
						 max={10}
						 min={0}
						 step={1}
						 value={this.state.aperture}
						 onChange={this.handleApertureChange.bind(this)}
					 />
                </div>



			</div>
		);
	}
};

ReactDOM.render(<App />, document.querySelector('#app'));
