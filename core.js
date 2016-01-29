function Template(objData, strTemplate){ //returns a new template function to match the data shape
  return Function("OBJ", "  var " + 
         Object.keys(objData)
           .filter(a=>strTemplate.indexOf(a)!==-1) // optimize by eliminating shadows for un-used vars
           .map(a=> a+"=OBJ."+a ) // assign all keys in objData to vars
           .join(",\n   ") +
          ";\n return `"+strTemplate+"`;"); // wrap template string around template contents.
}
