"use strict";
// -------------------------------------------------------------------------------------------
// Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: http://light.wtf/
// -------------------------------------------------------------------------------------------

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
	480,
	900,
	1800 ];

var shutter_tick = [ 0.001, 0.004, 0.015625, 0.0625, 0.25, 1, 4, 16, 60, 240, 900];
var iso = [100, 200, 400, 800, 1600, 3200, 6400];


var sidx = 2;
var iidx = 2;
var aidx = 5;


var shutter_str2val = function( str ) {
	console.log( 'Converting', str );
	if ( Number.isInteger( str ) ) {
		return 1 / Number(str);
	} else if ( str.indexOf("/") > 0 ) {
		return eval(str);
	} else if ( str.indexOf("m") > 0 ) {
		return Number(str.replace("m", "")) * 60;
	} else if ( str.indexOf("s") > 0 ) {
		return Number(str.replace("s", ""));
	}
}

var shutter_val2str = function ( value ) {
	if ( value < 1 ) { return 1/value; }
	if ( value > 59 ) {
		return value / 60 + "m";
	}
	return value + "s";
};

var shutterSlider = document.getElementById('shutter-slider');
noUiSlider.create( shutterSlider, {
	range: {
		min: 0.001,
		max: 1800,
		"5%": 0.002,		// 1/500
		"10%": 0.004,		// 1/250
		"15%": 0.008,		// 1/125
		"20%": 0.015625,	// 1/64
		"25%": 0.03125,		// 1/32
		"30%": 0.0625,		// 1/16
		"35%": 0.125,		// 1/8
		"40%": 0.25,
		"45%": 0.5,
		"50%": 1,
		"55%": 2,
		"59%": 4,
		"64%": 8,
		"68%": 16,
		"73%": 30,
		"77%": 60,
		"82%": 120,
		"86%": 240,
		"91%": 480,
		"96%": 900,
	},
	start: 250,
	snap: true,
	format: {
		to: shutter_val2str,
	  	from: shutter_str2val
	},
	pips: {
		mode: 'steps',
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


// // aperture slider
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
var isoSlider = document.getElementById('iso-slider');
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


apertureSlider.noUiSlider.on( 'update', function( values, handle ) {
	document.getElementById( 'aperture-val' ).innerText = values[handle];
} );

isoSlider.noUiSlider.on( 'update', function( values, handle ) {
	document.getElementById( 'iso-val' ).innerText = values[handle];
} );

shutterSlider.noUiSlider.on( 'update', function( values, handle ) {
	var value = values[handle];
	//document.getElementById('shutter-val').innerText = shutter_str2val( value );
} );

// Events
shutterSlider.noUiSlider.on( 'slide', function() { calculate('s'); } );
apertureSlider.noUiSlider.on( 'slide', function() { calculate('a'); } );
isoSlider.noUiSlider.on( 'slide', function() { calculate('a'); } );


function calculate(control) {
	console.log("Calculating...");
	var evValElem = document.getElementById('ev-val');

	var a = document.getElementById('aperture-val').innerText;
	var s = shutter_str2val( document.getElementById('shutter-val').innerText );
	var i = document.getElementById('iso-val').innerText;

	console.log( a, s, i );

    // exposure locked
    var ev_locked = document.getElementById('locked').checked;

    if ( ! ev_locked ) {
		var ev = calcExposureValue(a, s, i);
		evValElem.innerText = ev;
		return;
	}

	var ev_scene = Number(evValElem.innerText);
	console.log( 'EV Scene:', ev_scene);
	var current_ev = calcExposureValue( a, s, i );
	console.log("Current EV", current_ev);
	var ev_diff = ev_scene - current_ev;
	console.log( 'EV Diff', ev_diff );

	// adjust!
	document.getElementById('shutter-overunder').innerText = '';
	document.getElementById('aperture-overunder').innerText = '';

    // what control was used, adjust others
	if ( control == "a" ) {
		sidx = sidx - ev_diff;
		if ( sidx < 0 ) {
			// overexposed (cant get any faster)
			document.getElementById('shutter-overunder').innerText = "+" + Math.abs(sidx);
			sidx = 0;
		} else if ( sidx >= shutter.length ) {
			sidx = shutter.length - 1;
			// underexposed (cant get any slower)
			document.getElementById('shutter-overunder').innerText = "-";
		}
		document.getElementById('shutter-val').innerText = shutter_val2str(shutter[sidx]);
		document.getElementById('shutter-slider').value = shutter_val2str(shutter[sidx]);
	} else {
		console.log( 'Aperture Index', aidx)
		aidx = aidx + ev_diff;
		if ( aidx < 0 ) {
			// underexposed (cant make aperture bigger)
			document.getElementById('aperture-overunder').innerText = "-" + Math.abs(aidx);
			aidx = 0;
		} else if ( aidx >= aperture.length ) {
			// overexposed (cant make aperture smaller)
			var diff = aidx-aperture.length+1;
			document.getElementById('aperture-overunder').innerText = '+' + diff;
			aidx = aperture.length-1;
		}
		document.getElementById('aperture-val').innerText = aperture[aidx];
		document.getElementById('aperture-slider').value = aperture[aidx];
	}

}

function sceneChange() {
	var sel = document.getElementById('scene');
	var scene = sel.options[sel.selectedIndex].value;
	document.getElementById('ev-val').innerText = scene;
	document.getElementById('locked').checked = true;
	calculate('a');
}

function calcExposureValue(a, s, i) {
    var ev = Math.log2( Math.pow(a, 2) / s);
    return Math.round(ev - Math.log2(i / 100));
}
