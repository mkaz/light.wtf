// Javascript shared between calculators



var showOverlay = function(info) {
	var el = document.getElementById('overlay');
	el.style.left = 0;
	el.style.display = 'block';

	var data = document.getElementById( info + '-overlay' );
	document.getElementById('innards').innerHTML = data.innerHTML;
}

var hideOverlay = function() {
	var el = document.getElementById('overlay');
	document.getElementById('innards').innerHTML = '';

	el.style.left = -3000;
	el.style.display = 'none';
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
