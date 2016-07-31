

export const shutter_str2val = function( str ) {
	if ( str.indexOf("m") > 0 ) {
		return Number(str.replace("m", "")) * 60;
	} else if ( str.indexOf("s") > 0 ) {
		return Number(str.replace("s", ""));
	}
	return 1 / str;
}

export const shutter_val2str = function ( value ) {
	if ( value < 1 ) { return 1/value; }
	if ( value > 59 ) {
		return value / 60 + "m";
	}
	return value + "s";
};
