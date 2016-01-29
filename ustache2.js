
  
// ustache 2nd gen platform preview [CCBY4]-dandavis
function Template(strTemplate, objData, objImports, blnNow){ //returns a new template function to match the data shape
	var s=strTemplate, immed=blnNow||arguments.length==3 && objImports==true;
	function rep(hint, rx, replacment){	return s= (s.indexOf(hint)!==-1) ? s.replace(rx, replacment) : s, rep;	}
  
   	// run imports by replacing tokens with values from the imports object:
 rep("{{>",/\{\{>\s*([\w\W]+?)\s*\}\}/g, function(j,k){
          return objImports[k];
 })  	// replace else expressions: {{|path}} turns into {{/path}}{{^path}}
 ("{{|",/\{\{\|([\w\W]+?)\}\}/g, function(j,k){
           return "{{/"+k+"}}{{^"+k+"}}";
 })  // replace SEP sections
 ("{{SEP}}",/\{\{SEP\}\}([\w\W]+?)\{\{\/SEP\}\}/g, function(j,v){
           return "${ALL.length!==INDEX?`"+v+"`:''}";
 })  // replace array iterators:  {{#arr}} ${self.bold()} {{/arr}}
 ("{{#",/\{\{#([\w.]+)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
	return 	("${[].map.call("+k+"||[], function(self,INDEX,ALL){"+(v.indexOf("self") === -1 ? "with(self)" : "")+
			 "return ++INDEX&&\`"+v+"\`},this).filter(ok).join('')}");
 })  // replace conditionals:  {{#x>21}}ADULT{{/x>21}}
 ("{{?",/\{\{\?([\w\W]+?)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
           return "${"+k+"?`"+v+"`:''}";
 })  // replace negative conditionals:  {{^x>21}}ADULT{{/x>21}}
 ("{{^",/\{\{\^([\w\W]+?)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
           return "${!("+k+")?`"+v+"`:''}";
 })  // replace dots:  {{.}}
 ("{{.}}",/\{\{\.\}\}/g, "${self}"
 )   // replace injections:  {{=x}}
 ("{{",/\{\{=?([\w\W]+?)\}\}/g, function(j,k){
           return "${"+k+"}";
 })  // replace razors:  @x.y 
 ("@",/(\W)@([\w.()'",]+)([\s\b\W]|\b)/g, function(j,h,b,t){
           return h+"${"+b+"}"+(t||"");
 });

  var fn= Function("__", "var self=__,ok=x=>x!=null, " + 
         Object.keys(objData)
           .filter(a=>s.indexOf(a)!==-1) // optimize by eliminating shadows for un-used vars
           .map(a=> a+"=__."+a )+ // assign all used keys in objData to vars
          ";\n return `"+s+"`;"); // wrap template string around template contents.
  return immed?fn.call(this, objData):fn;
}
