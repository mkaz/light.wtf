"use strict";
// -----------------------------------------------------------
// Pinhole Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: http://light.wtf/
// -----------------------------------------------------------

var aperture = [32, 48, 64, 96, 128, 192, 256, 384];
var iso = [100, 200, 400, 800, 1600, 3200];

var aperture_default_index = 5;
var iso_default_index = 2;
var scene_default_index = 4;

var init = function() {

	// fill Pinhole options from data
	var apertureSel = document.getElementById( 'aperture' );
	for ( let val of aperture ) {
		var opt = document.createElement( 'option' );
		opt.appendChild( document.createTextNode( 'f/' + val  ) );
		opt.value = val;
		apertureSel.appendChild( opt );
	}
	apertureSel.addEventListener( 'change', calculate );

	// fill ISO options from data
	var isoSel = document.getElementById( 'iso' );
	for ( let val of iso ) {
		var opt = document.createElement( 'option' );
		opt.appendChild( document.createTextNode( val ));
		opt.value = val;
		isoSel.appendChild( opt );
	}
	isoSel.addEventListener( 'change', calculate );

	// fill scene options from data
	var sceneSel = document.getElementById( 'scene' );
	for ( let row of scene ) {
		var opt = document.createElement( 'option' );
		opt.appendChild( document.createTextNode( row[1] ));
		opt.value = row[0];
		sceneSel.appendChild( opt );
	}
	sceneSel.addEventListener( 'change', calculate );

	// check if previous index in local storage
	// otherwise set to defaults
	var aidx = localStorage.getItem('apertureIndex');
	var iidx = localStorage.getItem('isoIndex');
	var sidx = localStorage.getItem('sceneIndex');

	apertureSel.selectedIndex = ( aidx ) ? aidx : aperture_default_index;
	isoSel.selectedIndex = ( iidx ) ? iidx : iso_default_index;
	sceneSel.selectedIndex = ( sidx ) ? sidx : scene_default_index;

	calculate();
};

var calculate = function() {

	var apertureSel = document.getElementById( 'aperture' );
	var isoSel = document.getElementById( 'iso' );
	var sceneSel = document.getElementById( 'scene' );

	var aidx = apertureSel.selectedIndex;
	var iidx = isoSel.selectedIndex;
	var sidx = sceneSel.selectedIndex;

	// store off values to local storage
	localStorage.setItem('apertureIndex', aidx);
	localStorage.setItem('isoIndex', iidx);
	localStorage.setItem('sceneIndex', sidx);


	///////////////////////////////////////
	// base exposure: f/32 (aperture index = 0 )
	// film iso: 100 (iso index = 0 )
	// scene = 0.015625;
    var base_exposure = 0.015625; // 1/64 seconds
    var exposure = base_exposure * Math.pow(2, sidx);	// scene
    exposure = exposure * Math.pow(2, -1 * iidx);	// iso
    exposure = exposure * Math.pow(2, aidx);		// aperture

    document.getElementById('exposure-val').innerHTML = format_exp(exposure);

}

// format secs to better display
var format_exp = function(secs) {
    var dexp = "";

    if (secs > 3599) {
        hr = Math.floor(secs / 3600);
        min = Math.round((secs - hr*3600)/60);
        dexp = hr + " hrs " + min + " mins";
    }
    else if (secs > 60) {
        min = Math.floor(secs / 60);
        sec = Math.round(secs - min * 60);
        dexp = min + " mins " + sec + " secs";
    }
    else if (secs < 1) {
        var val = Math.round(1/secs);
        if (val == 1) { dexp = " 1 sec "; }
        else {
            dexp = "1/" + Math.round(1/secs) + " sec"
        }
    }
    else { dexp = Math.round(secs) + " secs"; }

    return dexp;
}

// lets do it
window.onload = init;

