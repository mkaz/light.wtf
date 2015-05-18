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
	if ( str.indexOf("m") > 0 ) {
		return Number(str.replace("m", "")) * 60;
	} else if ( str.indexOf("s") > 0 ) {
		return Number(str.replace("s", ""));
	}
	return 1 / str;
}

var shutter_val2str = function ( value ) {
	if ( value < 1 ) { return 1/value; }
	if ( value > 59 ) {
		return value / 60 + "m";
	}
	return value + "s";
};


Zepto("#shutter-slider").noUiSlider({
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
	}

});

Zepto('#shutter-slider').noUiSlider_pips({
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
});


// // aperture slider
Zepto("#aperture-slider").noUiSlider({
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
	}
});
Zepto('#aperture-slider').noUiSlider_pips({
	mode: 'steps',
	stepped: true,
	values: aperture,
	density: 16,
	format: wNumb({
		decimals: 1
	})
});


// iso slider
Zepto("#iso-slider").noUiSlider({
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
	}
});

Zepto('#iso-slider').noUiSlider_pips({
	mode: 'steps',
	stepped: true,
	values: iso,
	density: 16,

});

// Links
Zepto('#iso-slider').Link('lower').to(Zepto('#iso-val'));
Zepto('#aperture-slider').Link('lower').to(Zepto('#aperture-val'));
Zepto('#shutter-slider').Link('lower').to(Zepto('#shutter-val'));


// Events
Zepto("#shutter-slider").on({
	slide: function() {
		calculate('s');
	}
});

Zepto("#aperture-slider").on({
	slide: function() {
		calculate('a');
	}
});

Zepto("#iso-slider").on({
	slide: function() {
		calculate('a');
	}
});



function calculate(control) {

	var a = Zepto("#aperture-val").text();
	var s = shutter_str2val( Zepto("#shutter-val").text() );
	var i = Zepto('#iso-val').text();

    // exposure locked
    var ev_locked = Zepto('#locked').attr('checked');

    if (!ev_locked) {
		var ev = calcExposureValue(a, s, i);
		Zepto('#ev-val').text(ev);
		return;
	}

	var ev_scene = Number(Zepto("#ev-val").text());
	var current_ev = calcExposureValue( a, s, i );
	var ev_diff = ev_scene - current_ev;

	// adjust!
	Zepto('#shutter-overunder').text("");
	Zepto('#aperture-overunder').text("");

    // what control was used, adjust others
	if ( control == "a" ) {
		sidx = sidx - ev_diff;
		if ( sidx < 0 ) {
			// overexposed (cant get any faster)
			Zepto('#shutter-overunder').text("+" + Math.abs(sidx));
			sidx = 0;
		} else if ( sidx >= shutter.length ) {
			sidx = shutter.length - 1;
			// underexposed (cant get any slower)
			Zepto('#shutter-overunder').text("-");
		}
		Zepto('#shutter-val').text(shutter_val2str(shutter[sidx]));
		Zepto('#shutter-slider').val(shutter_val2str(shutter[sidx]));
	} else {
		aidx = aidx + ev_diff;
		if ( aidx < 0 ) {
			// underexposed (cant make aperture bigger)
			Zepto('#aperture-overunder').text("-" + Math.abs(aidx))
			aidx = 0;
		} else if ( aidx >= aperture.length ) {
			// overexposed (cant make aperture smaller)
			var diff = aidx-aperture.length+1;
			Zepto('#aperture-overunder').text('+' + diff)
			aidx = aperture.length-1;
		}
		Zepto('#aperture-val').text(aperture[aidx]);
		Zepto('#aperture-slider').val(aperture[aidx]);
	}

}

function sceneChange() {
	var sel = document.getElementById('scene');
	var scene = sel.options[sel.selectedIndex].value;
	Zepto("#ev-val").text(scene);
	Zepto('#locked').attr('checked', true);
	calculate('a');
}

function calcExposureValue(a, s, i) {
    var ev = Math.log2( Math.pow(a, 2) / s);
    return Math.round(ev - Math.log2(i / 100));
}
