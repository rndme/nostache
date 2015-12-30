// nostache.js by dandavis [CCBY4]

var nostache=(function() {
	var rxComments = /\{\{\![^}]*\}\}/g,
		rxIndex = /\$\{INDEX\}/g,
		rxImport = /\{\{>([^}]+)\}\}/g,
		rxSep = /\$\{SEP\}([^$]+)\$\{\/SEP\}/g,
		rxBraces = /\{\{([^\}]+)\}\}/g,
		rxElse = /\{\{\!([\w\.]+)\}\}/g,
		rxNot = /([\^])([^}]+)\}(.+?)\$\{\/\2/g,
		rxCompare = /([#])([^=]+)\=(.+?)\}(.+?)\$\{\/\2=\3/g,
		rxCompareNot = /([#])([^=]+)\!\=(.+?)\}(.+?)\$\{\/\2\!=\3/g,
		rxIf = /([#])([^}]+)\}(.+?)\$\{\/\2/g,
		rxLoop = /([\.])([^}]+)\}([\w\W]+?)\$\{\/\2/g,
		rxRazor=/(\W)@([#\^!\/\|\.\)\(]?[\w\.$|]+)/g,
		rxCarrot = /\$\{\.\}/g;


	function _tmp(s, ob, index, inner, c) {
		var z, ss = s
		.replace(rxIndex, index + 1) // turn INDEX keyword into numeric literal
		.replace(rxRazor, "$1{{$2}}") // convert Razor to normal syntax
		.replace(rxElse, "{{/$1}}{{^$1}}") // turn ELSE expressions into conditional syntax
		.replace(rxSep, c&&(index<c.length-1)?"$1":"")
		.replace(rxComments, "") // strip comment blocks
		.replace(rxBraces, "${$1}") // turn brace expressions into template string literals
		.replace(rxNot, "!($2)?\"$3\":''") // condense NOT block into template expression
		.replace(rxCompare, "$2==$3?\"$4\":''") // condense comparing IF block into template expression
		.replace(rxCompareNot, "$2!=$3?\"$4\":''") // condense comparing IF block into template expression
		.replace(rxIf, "$2?\"$3\":''") // condense IF block into template expression
		.replace(rxLoop, function(j,k,a,b){return "("+a+").map((a,b,c)=>_tmp.call(this,"+JSON.stringify(b)+",a,b,true,c),this).join('')";}) // condense loop block into template expression
		.replace(rxCarrot, "${ob}") // turn carrot marker into template expression
		, junk=console.info(ss, this), 
		rez = Function("_tmp, ob", "try{with(ob)return `" + ss + "`}catch(y){return  y.constructor.name + '::' + y.message;}");

		if(inner) return rez.call(this, _tmp, ob);
		return function(data) {
			return rez.call(this, _tmp, data);
		};
	}

    return function tmp(s, data, partials){
	var that= partials || this || {};
	s=s.replace(rxImport, function(j,p){return that[p];});
	return data ? _tmp.call(this,s).call(this, data) : _tmp(s);
    };

}());
