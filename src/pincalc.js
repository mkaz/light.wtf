// -----------------------------------------------------------
// Pinhole Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: https://light.wtf/pinhole/
// -----------------------------------------------------------

import { format_exp } from './common';

var scene = [
	[ '16', '16: Subject in bright sunlight, sand or snow' ],
	[ '15', '15: Subject in bright sunlight (Sunny 16 rule)' ],
	[ '14', '14: Hazy sunshine (soft shadows)' ],
	[ '13', '13: Bright cloudy day (no shadows)' ],
	[ '12', '12: Subject in shade, or overcast day' ],
	[ '11', '11: Sunsets or subject in deep shade' ],
	[ '10', '10: Immediate after sunset' ],
	[  '9', ' 9: Neon or bright signs (spot lit subject)' ],
	[  '8', ' 8: Floodlit stadium (bright day interior)' ],
	[  '7', ' 7: Indoor sports, shows, Amusement parks' ],
	[  '6', ' 6: Day interior, bright night' ],
	[  '5', ' 5: Home night interior, Night vehicles' ],
	[  '4', ' 4: Floodlit buildings, bright streetlights' ],
	[  '3', ' 3: Streetlights. Fireworks' ],
	[  '2', ' 2: Distant lights' ],
	[ '-2', ' -2: Full moon' ],
	[ '-4', ' -4: Half moon, Aurora borealis' ],
	[ '-6', ' -6: Quarter moon, dark starry night' ]
];

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


	// base exposure: f/32 (aperture index = 0 )
	// film iso: 100 (iso index = 0 )
	// scene = 0.015625;
    var base_exposure = 0.015625; // 1/64 seconds
    var exposure = base_exposure * Math.pow(2, sidx);	// scene
    exposure = exposure * Math.pow(2, -1 * iidx);	// iso
    exposure = exposure * Math.pow(2, aidx);		// aperture

    document.getElementById('exposure-val').innerHTML = format_exp(exposure);

}


// lets do it
window.onload = init;

