(function (that, factory) { // nostache.js by dandavis [CCBY4]  https://github.com/rndme/nostache
 if(typeof exports === 'object')   			factory(exports); 		// CommonJS
 else if(typeof define === 'function' && define.amd)	define(['exports'], factory); 	// AMD
 else							that.nostache = factory(); 	// script, wsh, asp  
}(this, function() { //  syntax RegExps		approximation/eg
	var rxImports = /\{\{>\s*([\w\W]+?)\s*\}\}/g,	// {{>...}}
	rxIndex = /\$\{INDEX\}/g, 			// ${INDEX}
	rxRazor=/(\W)@([#\^!\/\.\)\(]?[\w\.$]+)/g,	// @[#^!/.)(]*ab.c
	rxElse = /\{\{\|([\w\W]+?)\}\}/g,		// {{!...}}
	rxSep = /\$\{SEP\}([\w\W]+?)\$\{\/SEP\}/g, 	// ${SEP}...${/SEP}
	rxComments = /\{\{\![\w\W]*?\}\}/g,		// {{!...}}
	rxInject = /\{\{=([\w\W]+?)\}\}/g,		// {{=...}}
	rxBraces = /\{?\{\{&?([\w\W]+?)\}\}\}?/g,	// {{...}}
	rxNot =  /\$\{(\^)([\w\W]+?)\}(.+?)\$\{\/\2/g,	// ${^ ...}...${$1}
	rxCond = /\$\{(\?)([\w\W]+?)\}(.+?)\$\{\/\2/g,	// ${? ...}...${$1}
	rxIf =   /\$\{(\#)\s*([\w\W]+?)\s*\}([\w\W]+?)?\$\{\/\s*\2/g,	// ${^ ...}...${$1}
	rxObj = /\$\{\$([\w.]+?)\}([\w\W]+?)\$\{\/\1/g,	// ${$:. ...}...${$1}
	rxCarrot = /\$\{\.\}/g,				// ${.}
	rxPath = /\$\{\s*([\w\.]+)\s*\}/g,		// ${...}
	rxReserved = /\b((this)|(SEP)|(INDEX)|(KEY)|(__)|(SCOPE))\b/,
	rxDouble = /this\.\./g,
	json = JSON.stringify;	
  
	function _tmp(strTemplate, objContext, SCOPE, numIndex, blnInnerCall, arrList, varAllData) {	// string to ES6 converter/executer
		strTemplate = String(strTemplate)		// string FunctionBody of the dynamic rednerer
		.replace(rxIndex, numIndex + 1) 			// turn INDEX keyword into numeric literal
		.replace(rxRazor, "$1{{this.$2}}") 		// convert Razor to normal syntax
		.replace(rxInject, "{{ok(this.$1,this,true)}}") 	// make injections safe
		.replace(rxElse, "{{/$1}}{{^$1}}") 		// turn ELSE expressions into conditional syntax
		.replace(rxSep, arrList && (numIndex<arrList.length-1) ? "$1" : "" )	// replace SEP mini-sections with contents, or nothing of last
		.replace(rxComments, "") 			// strip comment blocks
		.replace(rxBraces, "${$1}")			// turn brace expressions into template string literals
		.replace(rxNot, "${(!this.$2||Array.isArray(this.$2)&&this.$2.length===0)?\"$3\":''")		// condense NOT block into template w/ mustache rules
		.replace(rxObj, function(j,o,s){return "${Object.keys(this."+o+").map(function(a,b,c){return _tmp.call(this,"+json(s)+",this[a]||a,SCOPE,b,true,c,__);},this["+json(o)+"]).join('')";}) // object iteration
		.replace(rxCond, "${this.$2?\"$3\":''")		// condense conditional block into ES6 template expression
		.replace(rxIf, function(j,k,arr,content){var tt= "this["+json(arr)+"]";	return "${ " + tt +" ? ( typeof "+tt+"=='object' ? ( Array.isArray("+tt+")? ("+tt+") : ["+tt+"]   ).map((a,b,c)=>_tmp.call(this,"+json(content)+",a,SCOPE,b,true,c,__),this).join('') :  _tmp.call(this,(typeof "+tt+"=='function'?"+tt+".call(this,"+json(content)+"):"+json(content)+"),this,SCOPE,0,true,[],'') 		  ) : '' ";})
		.replace(rxCarrot, "${this}")			// replace {{.}} with this pointer
		.replace(rxPath, function(j,path){ return rxReserved.test(path) ? "${"+path+"}" : "${ok(this."+path+",this)}"; })	  
		.replace(rxDouble,"this."); 			// fix possible dot dot bug to pass mustache unit tests

		var rez = Function("_tmp, ob, __, KEY, SCOPE", "\"use strict\"; "+escapeHtml+ok+" return `" + strTemplate + "`;");	// build string output renderer function
		if(blnInnerCall) return rez.call(objContext, _tmp, objContext, varAllData, arrList[numIndex],SCOPE);// if internally called, returns composited  string using context (not whole data)
		return function(data) { return rez.call(data, _tmp, data, data,"__",SCOPE); }; // returns a render function bound to the template internal renderer
	}
  
    return function nostache(strTemplate, data, objImports){	// accepts a string, data, and imports
		// run imports by replacing tokens with values from the imports object:
		if(objImports) strTemplate=strTemplate.replace(rxImports, function(j, name){ return objImports[name]; });
		return data ? // return a render function, or if given data also, a composited string result:
			_tmp.call(this, strTemplate, 0, {}).call(this, data) : 
			_tmp(strTemplate, 0, {}) ;
    };
  
  function ok(v,c,esc){var u; return (esc===true?escapeHtml:String)(v==u?'':(typeof v==='function'? v.call(c,v) : v));}
  function escapeHtml(a){return String(a).replace(/[&<>"'`=\/]/g,function(a){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"}[a]})};
}));
