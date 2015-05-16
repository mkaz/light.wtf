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
	0.01563,	// 1/64
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

var iso = [100, 200, 400, 800, 1600, 3200, 6400];

var aidx = 5; // f/8
var sidx = 2; // 1/250
var iidx = 2; // ISO 400
var ev = 12;

var shutter_tick = [ "1000", "500", "250", "125", "64", "32", "16", "8", "4", "1/2", "1s", "2s", "4s", "8s", "16s", "30s", "1m", "2m", "4m", "8m", "15m", "30m" ];
var shutter_str = [ "1/1000", "1/500", "1/250", "1/125", "1/64", "1/32", "1/16", "1/8", "1/4", "1/2", "1s", "2s", "4s", "8s", "16s", "30s", "1m", "2m", "4m", "8m", "15m", "30m" ];


// build sliders

var shutter_axis = d3.svg.axis().ticks(12).tickFormat(function(d) { return shutter_tick[d]; });;
d3.select('#shutter-slider').call(d3.slider().axis(shutter_axis).min(0).max(shutter.length-1).value(sidx).on("slide", function(evt, value) {
	let index = Math.round(value);
	d3.select('#shutter-val').text(shutter_str[index]);
	sidx = index;
	calculate('s');
}));

var aperture_axis = d3.svg.axis().ticks(aperture.length).tickFormat(function(d){ return aperture[d]; });
d3.select('#aperture-slider').call(d3.slider().axis(aperture_axis).min(0).max(aperture.length-1).snap(true).value(aidx).on("slide", function(evt, value) {
	d3.select('#aperture-val').text(aperture[value]);
	aidx = value;
	calculate('a');
}));

var iso_axis = d3.svg.axis().ticks(iso.length).tickFormat(function(d){ return iso[d]; });
d3.select('#iso-slider').call(d3.slider().axis(iso_axis).min(0).max(iso.length-1).snap(true).value(iidx).on("slide", function(evt, value) {
	d3.select('#iso-val').text(iso[value]);
	iidx = value;
	calculate('a');
}));


function calculate(control) {

	var a = aperture[aidx];
	var s = shutter[sidx];
	var i = iso[iidx];

    // exposure locked
    var ev_locked = d3.select('#locked').property('checked');

    if (!ev_locked) {
		console.log("Calculate new EV value");
		ev = calcExposureValue(a, s, i);
		d3.select('#ev-val').text(ev);
		return;
	}


	console.log("Exposure Locked!");
	return;

	current_ev = calcExposureValue( a, s, i );
	console.log("EV with Settings: " + current_ev);
	console.log("Settings: ");
	console.log("A Index: " + aidx);
	console.log("A Value: " + a);
	console.log("S Index: " + sidx);
	console.log("S Value: " + s);
	console.log("I Index: " + iidx);
	console.log("I Value: " + i);
	ev_diff = scene_ev - current_ev;
	console.log("EV Diff between Scene: " + ev_diff);

	// adjust!

    // what control was used, adjust others
	if ( control == "a" ) {
		sidx = sidx + ev_diff;
		selectBox('shutter', sidx);
	} else {
		aidx = aidx + ev_diff;
		selectBox('aperture', aidx);
	}

}

function sceneChange() {
	alert("TODO!");
	return;

    var scene = Number($("#scene").val());
	console.log("Scene: " + scene);
    $('#ev').val(scene);
    $('#locked').prop('checked', true);
    calculate('a');
}

function calcExposureValue(a, s, i) {
    var ev = Math.log2( Math.pow(a, 2) / s);
    return Math.round(ev - Math.log2(i / 100));
}
