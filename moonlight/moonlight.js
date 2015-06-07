
// -------------------------------------------------------------------------------------------
// Moonlight Exposure Calculator
// Marcus Kazmierczak, mkaz.com
// Published at: http://night.exposed/moonlight/
// -------------------------------------------------------------------------------------------

// values to display (slider has the stops)
var aperture = [ 1.4, 2.0, 2.8, 4.0, 5.6, 8, 11, 16, 22 ];
var iso = [ 50, 100, 200, 400, 800, 1600, 3200, 6400 ];

// stop differences for phases of moon
var moon = [13.5, 6.5, 3.5, 1.5, 0, 1.5, 3.5, 6.5, 13.5];

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

    exposure = base_exposure * Math.pow(2, moon[f_moon]);
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

// format secs to better display
function format_exp(secs) {
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
        val = Math.round(1/secs);
        if (val == 1) { dexp = " 1 sec "; }
        else {
            dexp = "1/" + Math.round(1/secs) + " sec"
        }
    }
    else { dexp = Math.round(secs) + " secs"; }
    
    return dexp;
}

