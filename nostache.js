// nostache.js by dandavis [CCBY4]  https://github.com/rndme/nostache
var nostache=(function() {
  // define syntax of the templates as RegExps:			approximation/eg
	var rxImports = /\{\{>([\w\W]+?)\}\}/g,			// {{>...}}
		rxIndex = /\$\{INDEX\}/g, 			// ${INDEX}
		rxRazor=/(\W)@([#\^!\/\|\.\)\(]?[\w\.$|]+)/g,	// @[#^!/.)(]*ab.c
		rxElse = /\{\{\!([\w\W]+?)\}\}/g,		// {{!...}}
		rxSep = /\$\{SEP\}([\w\W]+?)\$\{\/SEP\}/g, 	// ${SEP}...${/SEP}
		rxComments = /\{\{\!\-\-[\w\W]*?\-\-\}\}/g,	// {{!--...--}}
		rxBraces = /\{\{([\w\W]+?)\}\}/g,		// {{...}}
		rxNot = /\$\{([\^])([\w\W]+?)\}(.+?)\$\{\/\2/g,	// ${^ ...}...${$1}
		rxIf = /\$\{([#])([\w\W]+?)\}(.+?)\$\{\/\2/g,	// ${# ...}...${$1}
		rxLoop = /\$\{([\.])([\w\W]+?)\}([\w\W]+?)\$\{\/\2/g,	// ${. ...}...${$1}
		rxCarrot = /\$\{\.\}/g;	// ${.}

	function _tmp(s, ob, index, inner, c, data) {		// string to ES6 converter/executer
		var ss = s					// string FunctionBody of the dynamic rednerer
		.replace(rxIndex, index + 1) 			// turn INDEX keyword into numeric literal
		.replace(rxRazor, "$1{{$2}}") 			// convert Razor to normal syntax
		.replace(rxElse, "{{/$1}}{{^$1}}") 		// turn ELSE expressions into conditional syntax
		.replace(rxSep, c&&(index<c.length-1)?"$1":"")	// replace SEP mini-sections with contents, or nothing of last
		.replace(rxComments, "") 			// strip comment blocks
		.replace(rxBraces, "${$1}")			// turn brace expressions into template string literals
		.replace(rxNot, "${!($2)?\"$3\":''")		// condense NOT block into template expression
		.replace(rxIf, "${$2?\"$3\":''")			// condense IF block into template expression
		.replace(rxLoop, function(j,k,a,b){ 		// condense loop block into template expression:
			return "${("+a+").map((a,b,c)=>_tmp.call(this,"+JSON.stringify(b)+",a,b,true,c,__),this).join('')";
		}) 
		.replace(rxCarrot, "${ob}"),			// turn carrot marker into template expression
		rez = Function("_tmp, ob, __", "with(ob)return `" + ss + "`;");	// build string output renderer function

		// if internally called, return composited  string using context (not whole data):
		if(inner) return rez.call(this, _tmp, ob, data);

		// return a render function bound to the template internal renderer:
		return function(data) {	return rez.call(this, _tmp, data, data);};
	}

    return function tmp(strTemplate, data, imports){	// the nostache function, accepts a string, data, and imports
		// define imports from explictly-passed object, _this_, or a blank object
		var _imports= imports || this || {};
		// run imports by replacing tokens with values from the imports object:
		strTemplate=strTemplate.replace(rxImports, function(j,p){ return _imports[p]; });
		
		return data ? // return a render function, or if given data also, a composited string result:
			_tmp.call(this, strTemplate).call(this, data) : 
			_tmp(strTemplate) ;
    };
}());
