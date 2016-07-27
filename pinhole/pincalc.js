"use strict";
// -------------------------------------------------------------------------------------------
// Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: http://light.wtf/
// -------------------------------------------------------------------------------------------

var aperture = [32, 48, 64, 96, 128, 192, 256, 384];
var iso = [100, 200, 400, 800, 1600, 3200];

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
