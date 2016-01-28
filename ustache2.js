// ustache 2nd gen platform preview [CCBY4]-dandavis

function Template(objData, strTemplate){ //returns a new template function to match the data shape


  // replace else expressions: {{|path}} turns into {{/path}}{{^path}}
  strTemplate=strTemplate.replace(/\{\{\|([\w\W]+?)\}\}/g, function(j,k){
           return "{{/"+k+"}}{{^"+k+"}}";
  })
  // replace array iterators:  {{#arr}} ${self.bold()} {{/arr}}
  strTemplate=strTemplate.replace(/\{\{#([\w.]+)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
           return "${[].map.call("+k+"||[], (self,INDEX)=>\` "+v+"\` ).filter(notNull).join('')}";
  })
  // replace conditionals:  {{#x>21}}ADULT{{/x>21}}
 .replace(/\{\{\?([\w\W]+?)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
           return "${"+k+"?`"+v+"`:''}";
  })
  // replace negative conditionals:  {{^x>21}}ADULT{{/x>21}}
 .replace(/\{\{\^([\w\W]+?)\}\}([\w\W]+?)(\{\{\/\1\}\})/g, function(j,k,v){
           return "${!("+k+")?`"+v+"`:''}";
  })
  // replace injections:  {{=x}}
  .replace(/\{\{=([\w\W]+?)\}\}/g, function(j,k){
           return "${"+k+"}";
  })
  // replace razors:  @x.y 
  .replace(/(\W)@([\w.()'",]+)([\s\b\W])/g, function(j,h,b,t){
           return h+"${"+b+"}"+(t||"");
  });


  return  Function("__", "  var notNull=x=>x!=null, " + 
         Object.keys(objData)
           .filter(a=>strTemplate.indexOf(a)!==-1) // optimize by eliminating shadows for un-used vars
           .map(a=> a+"=__."+a ) // assign all used keys in objData to vars
           .join(",\n   ") +
          ";\n return `"+strTemplate+"`;"); // wrap template string around template contents.
}
