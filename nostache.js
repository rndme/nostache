  // nostache.js by dandavis [CCBY4]  https://github.com/rndme/nostache
var nostache=(function() {
  // define syntax of the templates as RegExps:			approximation/eg
	var rxImports = /\{\{>([\w\W]+?)\}\}/g,			// {{>...}}
		rxIndex = /\$\{INDEX\}/g, 			// ${INDEX}
		rxRazor=/(\W)@([#\^!\/\.\)\(]?[\w\.$]+)/g,	// @[#^!/.)(]*ab.c
		rxElse = /\{\{\!([\w\W]+?)\}\}/g,		// {{!...}}
		rxSep = /\$\{SEP\}([\w\W]+?)\$\{\/SEP\}/g, 	// ${SEP}...${/SEP}
		rxComments = /\{\{\!\-\-[\w\W]*?\-\-\}\}/g,	// {{!--...--}}
		rxBraces = /\{\{([\w\W]+?)\}\}/g,		// {{...}}
		rxBracesKey = /\{\{([\w]+?)\}\}/g,		// {{...}}
		rxNot = /\$\{(\^)([\w\W]+?)\}(.+?)\$\{\/\2/g,	// ${^ ...}...${$1}
		rxIf = /\$\{(\#)([\w\W]+?)\}(.+?)\$\{\/\2/g,	// ${^ ...}...${$1}
		rxObj = /\$\{(\.)([\w.]+?)\:([\w.]+?)\}([\w\W]+?)\$\{\/\2:\3/g,	// ${.:. ...}...${$1}
		rxLoop = /\$\{(\.)([\w\W]+?)\}([\w\W]+?)\$\{\/\2/g,	// ${. ...}...${$1}	
		rxCarrot = /\$\{\.\}/g,	// ${.}
		json=JSON.stringify;
		
	function _tmp(strTemplate, objContext, numIndex, blnInnerCall, arrList, varAllData, strKey) {	// string to ES6 converter/executer
		strTemplate = strTemplate			// string FunctionBody of the dynamic rednerer
		.replace(rxIndex, numIndex + 1) 			// turn INDEX keyword into numeric literal
		.replace(rxRazor, "$1{{this.$2}}") 			// convert Razor to normal syntax
		.replace(rxElse, "{{/$1}}{{^$1}}") 		// turn ELSE expressions into conditional syntax
		.replace(rxSep, arrList && (numIndex<arrList.length-1) ? "$1" : "" )	// replace SEP mini-sections with contents, or nothing of last
		.replace(rxComments, "") 			// strip comment blocks
		.replace(rxBraces, "${$1}")			// turn brace expressions into template string literals
		.replace(rxNot, "${!(this.$2)?\"$3\":''")		// condense NOT block into template expression
		.replace(rxIf, "${this.$2?\"$3\":''")			// condense IF block into template expression
		// condense array+object loops into template expressions:
		.replace(rxObj, (j,k,o,prop,s)=> "${Object.keys(this."+o+").map(function(a,b,c){return _tmp.call(this,"+json(s)+",this[a]||a,b,true,c,__,"+json(prop)+");},this["+json(o)+"]).join('')") // object 
		.replace(rxLoop, (j,k,arr,prop)=> "${(this."+arr+").map((a,b,c)=>_tmp.call(this,"+json(prop)+",a,b,true,c,__),this).join('')") // array
		.replace(rxCarrot, "${this}");			// turn carrot marker into template expression
	
	  
		var rez = Function("_tmp, ob, __, "+strKey, "\"use strict\";return `" + strTemplate + "`;");	// build string output renderer function
		if(blnInnerCall) return rez.call(objContext, _tmp, objContext, varAllData, arrList[numIndex]);// if internally called, returns composited  string using context (not whole data)
		return function(data) { return rez.call(data, _tmp, data, data); }; // returns a render function bound to the template internal renderer
	}

    return function tmp(strTemplate, data, objImports){	// the nostache function, accepts a string, data, and imports
		// run imports by replacing tokens with values from the imports object:
		if(objImports) strTemplate=strTemplate.replace(rxImports, (j, name)=> objImports[name] );
		
		return data ? // return a render function, or if given data also, a composited string result:
			_tmp.call(this, strTemplate).call(this, data) : 
			_tmp(strTemplate) ;
    };
}());
