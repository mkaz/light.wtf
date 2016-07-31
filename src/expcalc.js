// -------------------------------------------------------------------------------------------
// Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: http://light.wtf/
// -------------------------------------------------------------------------------------------

import { shutter_str2val, shutter_val2str } from './shutter-utils';
import { calculateEV, format_exp, showOverlay, hideOverlay } from './common';

var aperture = [1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22];
var shutter = [
	0.001,		// 1/1000
	0.002,		// 1/500
	0.004,		// 1/250
	0.008,		// 1/125
	0.015625,	// 1/64
	0.03125,	// 1/32
	0.0625,		// 1/16
	0.125,		// 1/8
	0.25,
	0.5,
	1,
	2,
	4,
	8,
	16,
	30,
	60,
	120,
	240,
	480 ];

var shutter_tick = [ 0.001, 0.004, 0.015625, 0.0625, 0.25, 1, 4, 16, 60, 240, 900];
var iso = [100, 200, 400, 800, 1600, 3200, 6400];

var sidx = 2;	// default shutter index
var iidx = 2;	// default iso index
var aidx = 5;	// default aperture index

var shutterSlider = document.getElementById('shutter-slider');
noUiSlider.create( shutterSlider, {
	range: {
		min: 0.001,
		"5%": 0.002,		// 1/500
		"11%": 0.004,		// 1/250
		"17%": 0.008,		// 1/125
		"23%": 0.015625,	// 1/64
		"29%": 0.03125,		// 1/32
		"35%": 0.0625,		// 1/16
		"41%": 0.125,		// 1/8
		"47%": 0.25,
		"53%": 0.5,
		"59%": 1,
		"64%": 2,
		"69%": 4,
		"74%": 8,
		"79%": 16,
		"84%": 30,
		"89%": 60,
		"93%": 120,
		"97%": 240,
		max: 480,
	},
	start: 250,
	snap: true,
	format: {
		to: shutter_val2str,
	  	from: shutter_str2val
	},
	pips: {
		mode: 'steps',
		stepped: true,
		values: shutter,
		density: 25,
		filter: function( val, type ) { // return 0 don't shot, 1 = large, 2 = small
			if ( shutter_tick.indexOf(val) >= 0 ) { return 1; }
			else { return 0; }
		},
		format: {
			to: shutter_val2str,
			from: shutter_str2val
		}
	}
});


// aperture slider
var apertureSlider = document.getElementById('aperture-slider');
noUiSlider.create( apertureSlider, {
	range: {
		min: 1.4,
		max: 22,
		"12.5%": 2.0,
		"25%": 2.8,
		"37.5%": 4.0,
		"50%": 5.6,
		"62.5%": 8.0,
		"75%": 11.0,
		"87.5%": 16.0
	},
	start: 8.0,
	snap: true,
	format: {
		to: function ( value ) { return value; },
	  from: function ( value ) { return value; }
	},
	pips: {
		mode: 'steps',
		stepped: true,
		values: aperture,
		density: 16,
		format: wNumb({
			decimals: 1
		})
	}
});


// iso slider
var isoSlider = document.getElementById( 'iso-slider' );
noUiSlider.create( isoSlider, {
	range: {
		min: 100,
		max: 6400,
		"17%": 200,
		"34%": 400,
		"51%": 800,
		"68%": 1600,
		"85%": 3200
	},
	start: 400,
	snap: true,
	format: {
	  to: function ( value ) { return value; },
	  from: function ( value ) { return value; }
	},
	pips: {
		mode: 'steps',
		stepped: true,
		values: iso,
		density: 16,
	}
});

// link slider updates to update value
isoSlider.noUiSlider.on( 'update', function( values, handle ) {
	document.getElementById( 'iso-val' ).innerText = values[handle];
});

apertureSlider.noUiSlider.on( 'update', function( values, handle ) {
	document.getElementById( 'aperture-val' ).innerText = values[handle];
});

shutterSlider.noUiSlider.on( 'update', function( values, handle ) {
	document.getElementById( 'shutter-val' ).innerText = values[handle];
});

// do calculations when slider changes
isoSlider.noUiSlider.on( 'slide', function() { calculate( 'a' ); } );
apertureSlider.noUiSlider.on( 'slide', function() { calculate( 'a' ); } );
shutterSlider.noUiSlider.on( 'slide', function() { calculate( 's' ); } );

// event listener for changing drop down for scene
document.getElementById( 'scene' ).addEventListener( 'change', function() {
	var sel = document.getElementById('scene');
	var scene = sel.options[sel.selectedIndex].value;
	document.getElementById( 'ev-val' ).innerText = scene;
	document.getElementById( 'locked' ).checked = true;
	calculate('a');
});


var calculate = function(control) {
	var avalElem = document.getElementById( 'aperture-val' );
	var svalElem = document.getElementById( 'shutter-val' );
	var ivalElem = document.getElementById( 'iso-val' );

	var a = avalElem.innerText;
	var s = shutter_str2val( svalElem.innerText );
	var i = ivalElem.innerText;

	var evElem = document.getElementById( 'ev-val' );
	var shAdjElem = document.getElementById( 'shutter-overunder' );
	var apAdjElem = document.getElementById( 'aperture-overunder' );

    // check if exposure locked, if not update
    if ( ! document.getElementById( 'locked' ).checked ) {
		var ev = calculateEV(a, s, i);
		evElem.innerText = ev;
		return;
	}

	var ev_scene = Number( evElem.innerText );
	var current_ev = calculateEV( a, s, i );
	var ev_diff = ev_scene - current_ev;

	// reset the adjust elements
	shAdjElem.innerText = '';
	apAdjElem.innerText = '';

    // what control was used, adjust others
	if ( control == "a" ) {
		sidx = sidx - ev_diff;
		if ( sidx < 0 ) {
			// overexposed (cant get any faster)
			shAdjElem.innerText = '+' + Math.abs(sidx);
			sidx = 0;
		} else if ( sidx >= shutter.length ) {
			var diff = sidx - shutter.length + 2;
			sidx = shutter.length - 1;
			// underexposed (cant get any slower)
			shAdjElem.innerText = "x" + diff;
		}
		svalElem.innerText = shutter_val2str(shutter[sidx]);
		shutterSlider.noUiSlider.set( shutter_val2str(shutter[sidx]) );
	} else {
		aidx = aidx + ev_diff;
		if ( aidx < 0 ) {
			// underexposed (cant make aperture bigger)
			apAdjElem.innerText = "-" + Math.abs(aidx);
			aidx = 0;
		} else if ( aidx >= aperture.length ) {
			// overexposed (cant make aperture smaller)
			var diff = aidx-aperture.length+1;
			apAdjElem.innerText = '+' + diff;
			aidx = aperture.length-1;
		}
		avalElem.innerText = aperture[aidx];
		apertureSlider.noUiSlider.set( aperture[aidx] );
	}

}

