// ustache 2nd gen platform preview [CCBY4]-dandavis
// ustache 2nd gen platform preview [CCBY4]-dandavis
function Template(strTemplate, objData){ //returns a new template function to match the data shape

 function rep(hint, rx, replacment){	
  return strTemplate= (strTemplate.indexOf(hint)!==-1) ? strTemplate.replace(rx, replacment) : strTemplate, rep;
 }

  	// replace else expressions: {{|path}} turns into {{/path}}{{^path}}
 rep("{{|",/\{\{\|([\w\W]+?)\}\}/g, function(j,k){
           return "{{/"+k+"}}{{^"+k+"}}";
 })   // replace conditionals:  {{#x>21}}ADULT{{/x>21}}
 ("{{#",/\{\{\?([\w\W]+?)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
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

   return  Function("self", "var ok=x=>x!=null, " + 
         Object.keys(objData)
           .filter(a=>strTemplate.indexOf(a)!==-1) // optimize by eliminating shadows for un-used vars
           .filter(/./.test, /^\w+$/) // only alias valid var identifiers
           .map(key=> key+"=self."+key )+ // assign all used keys in objData to vars
          ";\n return `"+strTemplate+"`;"); // wrap template string around template contents.
}

