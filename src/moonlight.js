// -------------------------------------------------------------------------------------------
// Moonlight Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: https://light.wtf/moonlight/
// -------------------------------------------------------------------------------------------

import { format_exp } from './common';

// values to display (slider has the stops)
var aperture = [ 1.4, 2.0, 2.8, 4.0, 5.6, 8, 11, 16, 22 ];
var iso = [ 50, 100, 200, 400, 800, 1600, 3200, 6400 ];

// stop differences for phases of moon
var moon = [13.5, 6.5, 3.5, 1.5, 0, 1.5, 3.5, 6.5, 13.5];

// attach events
document.getElementById( 'moon0' ).addEventListener( 'click', function() { setMoon(0); } );
document.getElementById( 'moon1' ).addEventListener( 'click', function() { setMoon(1); } );
document.getElementById( 'moon2' ).addEventListener( 'click', function() { setMoon(2); } );
document.getElementById( 'moon3' ).addEventListener( 'click', function() { setMoon(3); } );
document.getElementById( 'moon4' ).addEventListener( 'click', function() { setMoon(4); } );
document.getElementById( 'moon5' ).addEventListener( 'click', function() { setMoon(5); } );
document.getElementById( 'moon6' ).addEventListener( 'click', function() { setMoon(6); } );
document.getElementById( 'moon7' ).addEventListener( 'click', function() { setMoon(7); } );
document.getElementById( 'moon8' ).addEventListener( 'click', function() { setMoon(8); } );

document.getElementById( 'moon' ).addEventListener( 'change', function() { calculate(); } );
document.getElementById( 'iso' ).addEventListener( 'change', function() { calculate(); } );
document.getElementById( 'aperture' ).addEventListener( 'change', function() { calculate(); } );

function log10(x) { return Math.log(x)/Math.log(10);  }

function calculate() {
    var el_iso = document.getElementById('iso-val');
    var el_aperture = document.getElementById('aperture-val');
    var el_exposure = document.getElementById('exposure-val');

    var f_moon = parseInt(document.getElementById('moon').value, 10);
    var f_iso = parseInt(document.getElementById('iso').value, 10);
    var f_aperture = parseInt(document.getElementById('aperture').value, 10);

    el_iso.innerHTML = iso[f_iso];
    el_aperture.innerHTML = "f/" + aperture[f_aperture];

    // base exposure is full moon
    // f/8, 8 min at ISO 100  (480 secs)
    // Zero values is full moon at f/1.4 at ISO 50
    var base_exposure = 30; // seconds

    var exposure = base_exposure * Math.pow(2, moon[f_moon]);
    exposure = exposure * Math.pow(2, -1 * f_iso);
    exposure = exposure * Math.pow(2, f_aperture);

    el_exposure.innerHTML = format_exp(exposure);
}


// run calculate on load
window.onload = function() {
    calculate();
}

// set the moon phase slider to num
function setMoon(num) {
    document.getElementById('moon').value = num;
    calculate();
}