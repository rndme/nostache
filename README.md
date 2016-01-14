# ustache
### mustache templates w/ a micro ES6 core
A 2kb template engine that does 80% of what mustache does, and with extra declarative-view features. <br /> <br />

## Contents
* [Design](#design)
* [Usage](#usage)
* [Compared to Mustache, Handlebars, and Hogan](#compared-to-mustache-handlebars-and-hogan)
* [Syntax Features](#syntax-features)
   * [Injection](#injection)
   * [Imports](#imports)
   * [Looping](#looping)
   * [Conditionals](#conditionals)
   * [Razor Syntax](#razor-syntax)
   * [{{|path}} else syntax](#path-else-syntax)
   * [{{INDEX}}](#index)
   * [{{SEP}} mini-section](#sep-mini-section)
   * [{{__.key}} root syntax](#__key-root-syntax)
   * [{{SCOPE}} state](#scope-state-object)
 
 


## Design
A RegExp-based transpiler with imports constructs an [ES6 template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings#Browser_compatibility) that evaluates the embeded exressions. It's only about 50 lines of code, making it easy to fork for customized applications. It's written with as few moving peices as possible, with an eye towards customization without complication.  - [top](#contents)



## Usage
#### (a string template) to return a function that returns an HTML string when passed an object: <br />
```
var fnRender = ustache(strTemplate),
strOutput = fnRender(objData);
````

#### (a string template and object of data) to invoke immediately:<br />
`strOutput=ustache(strTemplate, object);`

#### (a string template, object of data, and object of imports (partials) ) :
`strOutput = ustache(strTemplate, objData, objImports);` <br />
`fnRender = ustache(strTemplate, null, objImports);` 
[top](#contents)
  
 
## Compared to Mustache, Handlebars, and Hogan
ustache is congruent with Mustache/Hogan, with many added features. It's not logic-less (JS expressions can be used mid-template).  ustache needs pure functions, so it uses `this` in front of plain injections (see below). Those injections are also not HTML escaped by default like Mustache. you can both prefix `this` and HTML escape injections using the `{{=name}}` tag. 

Mustache also differs with minor features: it's hoisting of context, allowing lambdas in data (functions that return functions), iterating the whole data argument as an array using `{{#.}}{{.}}{{/.}}`, allowing non-valid property identifiers like `{{#person?}}`, imports importing imports, and allowing custom delimters, none of which ustache supports. Despite the limits, ustache passes about 3/4 of Mustache's unit tests, with the failing ones mainly relate to auto-escaping and hoisting plus the above-noted differences on seldom-used features.

Handlebars shares many capabilities with ustache, but ustache syntax is more explict on the closing tags, ex. `{{/title}}{{/comments}}` instead of `{{/if}}{{/each}}`. ustache is also the only mustache engine (afaik) that uses ES6 template strings instead of a full-blown parser.   [top](#contents)


## Syntax Features
You can use normal Mustche syntax, with a few exceptions and many additions. See the [mustache.js project](https://github.com/janl/mustache.js/) for basic examples, review the [unit tests](https://github.com/rndme/ustache/blob/master/tests.js), [run them live](http://danml.com/nostache/tests.html), or keep reading.

### Injection
`{{this.name}}` | `@name ` | `{{=name}}` | `{{this.sub.name.prop}}` | `{{this.user['name']}}` | `{{this.name.bold()}}`  <br />
Inserts the value of the named path. Unlike Mustache, you can use bracket notation and invoke methods inline, even passing arguments to methods via primitives or early-run _imports_. You can perform calculations mid-expression using virtually any valid javascript expression. You can reach not only in-scope variables, but globals like `Math.random()` as well. Also keep in mind that you can use ES6 template strings to inject dynamic values into the template before it executes.
<br /> ex: `ustache("Hello {{=name}}", {name: "Fred"}) == "Hello Fred";`
<br /> ex: `ustache("Hello <b>{{this.name}}</b>", {name:"Fred"}) == "Hello <b>Fred</b>";`
<br /> ex: `ustache("Hello @name", {name:"Fred".bold()}) == "Hello <b>Fred</b>";`
<br /> ex: `ustache("Hello {{this.name.bold()}}", {name:"Fred"}) == "Hello <b>Fred</b>";`
<br /> ex: `ustache("Hello {{=name}}", {name:"Fred".bold()}) == "Hello &lt;b&gt;Fred&lt;&#x2F;b&gt;";`
<br /> ex: `ustache("Random Number: {{1/Math.random()}}", {}); // yes, expressions work!`
 [top](#contents)

### Imports
`{{>name}}` <br />
Imports use the same syntax, but work slightly differently than Mustache's partials. Whereas Mustache partials are executed in-flow and with surrounding context, ustache imports run globally just prior to templating. Global (flat) processing executes much faster than Mustache's, but also means that ustache imports cannot import other imports. All imported values should be direct properties of the _imports_ object (no nested sub-objects).  As they execute, imports simply replace literal text, with no consideration of context or validity. This is a good thing because you can inject template code, and it will get executed as though it were hard-coded, providing a macro-like stage of code execution.
 [top](#contents)

### Looping

#### {{#arr}} Array Iteration
`{{#users}}` <br />
Iterates data Arrays and repeats their content for each element in the Array.
Due to the simplicity of the engine, there is on one restriction on nested looping: you cannont have a duplicated property name iterated on different nested levels; eg. `{users:{users:[1,2,3]}}` is no good. Note that # tags also provide other capabilities: they acti like switches if fed a boolean, and they drill into nested data objects if they point to an object.
<br /> ex: ` ustache("{{#numbers}}#{{/numbers}}", {numbers:[11,22,33]}) == "###"; `
<br /> ex: ` ustache("{{#numbers}}{{.}} {{/numbers}}", {numbers:[11,22,33]}) == "11 22 33 "; `
<br /> ex: ` ustache("{{#numbers}}{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) == "11, 22, 33"; `
<br /> ex: ` ustache("{{#numbers}}{{INDEX}}:{{.}} {{/numbers}}", {numbers:[11,22,33]}) == "1:11 2:22 3:33 "; `
<br /> ex: ` ustache("{{#numbers}}{{INDEX}}:{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) == "1:11, 2:22, 3:33"; `
<br /> ex: ` ustache("{{#numbers}}{{ (this.i%2) ? this.i : ''}}{{/numbers}}", {numbers:[{i:11},{i:22},{i:33}]}) == "1133"; `
 [top](#contents)
  
 
#### {{$obj}} Object Iteration
 Iterates over objects using a placeholder KEY name within the section tag. <br />
 Inside the section KEY will equal the name of the object property's key and `.` will equal the property value.
<br /> ex:  `ustache('{{$a}}{{KEY}}: {{.}} {{/a}}', {a:{b:1,c:5}}) == "b: 1 c: 5 ";`

### Conditionals
`{{#total}}` | `{{^total}}` | `{{#section}}` <br />
Same are mustache, if the target property is non falsy, the contents are included. <br />

`{{?total>0}}` | `{{?section=="home"}}` <br />
This is a big piece of functionality missing from Mustache.js, and can be quite helpful when constructing views. If the expression returns falsy, the contents are ommited. If the expression is truthy, the contents are included/executed. This can help add "active" classes to navigation and show/hide sections content according to task/location/time/etc. Logic in the template allow declarative view definition and eliminates the need for DOM-binding to achieve view updates.
<br /> ex: ` ustache("i is {{?i > 5}}big{{/i > 5}}{{?i<6}}small{{/i<6}}", {i: 2}) == "i is small"; `
<br /> ex: ` ustache("i is {{?i > 5}}big{{/i > 5}}{{?i<6}}small{{/i<6}}", {i: 9}) == "i is big"; `
 [top](#contents)

### Razor Syntax
`@lname, @fname` | ` @#users  @INDEX: @name  @/users` <br />
"Inspired" by MS's VS/MVC razor templates, this alternative syntax can keep visual boilerplate costs down. You can use it for injection, looping, and conditionals, but the allowed characters are more restricted that the traditional `{{}}` delimiters (`\w\.$|`) , so it's not the best choice for complex logic. Lastly, it avoids mistaking email addresses for tokens by insisting upon a non-wordy char to the left of the `@`.
<br /> ex: ` ustache("Hello @name", {name: "Fred"}) == "Hello Fred"; `
<br /> ex: ` ustache("Chars: @name.length", {name: "Fred"}) == "Chars: 4"; `
<br /> ex: ` ustache("Hello @user.name", { user: {name: "Fred"} }) == "Hello Fred"; `
 [top](#contents)
 
 
### {{|path}} else syntax
`{{|path}}` turns into `{{/path}}{{^path}}`, for simpler _else_ handling of regular mustache conditionals.
<br /> ex: ` ustache("{{#i}}yes{{|i}}no{{/i}}", {i: 9}) == "yes"; `
<br /> ex: ` ustache("{{#i}}yes{{|i}}no{{/i}}", {i: 0}) == "no"; `
[top](#contents)
    
    
### {{INDEX}}
  Simple "contstant" that returns the current index when iterating an Array.
<br /> ex: ` ustache("{{#numbers}}{{INDEX}}:{{.}} {{/numbers}}", {numbers:[11,22,33]}) == "1:11 2:22 3:33 "`
<br />[top](#contents)
 
 
### {{SEP}} mini-section
   Simple "constant" that returns the enclosed block for every value except for the last. 
<br /> ex: ` ustache("{{#numbers}}{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) == "11, 22, 33"; `
<br />[top](#contents)
 
 
### {{__.key}} root syntax
`{{__.key}}` reaches _key_ on the data object given to ustache, bypassing local conflicts. 
<br /> ex:  ` ustache('{{#b}}{{a}}|{{__.a}} {{/b}}', {a:123, b:[{a:1}]} ) == "1|123 "; `
 <br />[top](#contents)
 
 
### {{SCOPE}} state object
`SCOPE` is a maleable internal object available to templates. You can use it to store view state like scroll positions, checkboxes options, active section, etc. The object is auto-created or passed during the initial call to ustache(), and inherited by imports and all code in the template, allowing templates to act more like components. You can reach this object as `SCOPE` from any injection, section, or conditional template tag.
<br /> ex:  ` ustache("{{SCOPE.nick=this.name.bold(),''}} Hello {{SCOPE.nick}}", {name:"Fred"}) == " Hello <b>Fred</b>";`
<br /> see SCOPE used to make simple components at an [online SCOPE demo](http://pagedemos.com/hfk6pjn6zk8r/)


_______________________________________

<br />[top](#contents)
 
