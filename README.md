# nostache
### mustache.js-like templates w/ a tiny ES6 core

## Design
A pre-compile-able 1kb engine that does what mustache does, and with extra declartive-view features. <br /> <br />

To get all geeky: A RegExp-based 1-pass top-down transpiler (with imports) constructs a JIT ES6 template string that evaluates the embeded exressions. The only late-run code is for looping and `{{SEP}}` expressions, everything else is pure string processing, which makes it easy to reason about. It's 50 LOCs weight makes it easy to fork for customized applications.



## Usage
#### (a string template) to return a function that returns an HTML string when passed an object: <br />
```
var fnRender = nostache(strTemplate),
strOutput = fnRender(objData);
````

#### (a string template and object of data) to invoke immediately:<br />
`strOutput=nostache(strTemplate, object);`

#### (a string template, object of data, and object of imports/imports) :
`strOutput = nostache(strTemplate, objData, objImports);` <br />
`fnRender = nostache(strTemplate, null, objImports);` 


## Syntax Features

### Injection
`{{name}}` | `{{root.branch.sub.name.prop}}` | `{{user['name']}}` | `{{name.bold()}}` | `{{++this['total'] * 10 }}` <br />
Inserts the value of the named path. Unlike Mustache, you can use bracket notation and invoke methods inline, even passing arguments to methods via primitives or early-run _imports_. You can perform calculations mid-expression using virtually any valid javascript expression. You can reach not only in-scope variables, but globals like `Math.random()` as well. Also keep in mind that you can use ES6 template strings to inject dynamic values into the template before it executes.
<br /> ex: `nostache("Hello {{name}}", {name: "Fred"}) == "Hello Fred";`
<br /> ex: `nostache("Hello <b>{{name}}</b>", {name:"Fred"}) == "Hello <b>Fred</b>";`
<br /> ex: `nostache("Hello {{name}}", {name:"Fred".bold()}) == "Hello <b>Fred</b>";`
<br /> ex: `nostache("Hello {{name.bold()}}", {name:"Fred"}) == "Hello <b>Fred</b>";`
<br /> ex: `nostache("Random Number: {{1/Math.random()}}", {});`



### Imports
`{{>name}}` <br />
Imports use the same syntax, but work slightly differently than Mustache's partials. Whereas Mustache partials are executed in-flow and with surrounding context, Nostache imports run globally just prior to templating. Global (flat) processing executes much faster than Mustache's, but also means that Nostache imports cannot import other imports. All imported values should be directed properties of the _imports_ object (no nested sub-objects). You can omit the _imports_ object at call-time, which triggers import resolution to look at the _this_ object instead, which allows a handy way to bind() a set of resources to a rendering function. As they execute, imports simply replace literal text, with no consideration of context or validity. This is a good thing because you can inject template code, and it will get executed as though it were hard-coded, providing a macro-like stage of code execution.


### Looping
`{{.users}}` <br />
Loops Traverse data Arrays and repeat their content for each element in the Array.
Due to the simplicity of the engine, there is on one restriction on nested looping: you cannont have a duplicated property name iterated on different nested levels; eg. `{users:{users:[1,2,3]}}` is no good.
<br /> ex: ` nostache("{{.numbers}}#{{/numbers}}", {numbers:[11,22,33]}) == "###"; `
<br /> ex: ` nostache("{{.numbers}}{{.}} {{/numbers}}", {numbers:[11,22,33]}) == "11 22 33 "; `
<br /> ex: ` nostache("{{.numbers}}{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) == "11, 22, 33"; `
<br /> ex: ` nostache("{{.numbers}}{{INDEX}}:{{.}} {{/numbers}}", {numbers:[11,22,33]}) == "1:11 2:22 3:33 "; `
<br /> ex: ` nostache("{{.numbers}}{{INDEX}}:{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) == "1:11, 2:22, 3:33" `
<br /> ex: ` nostache("{{.numbers}}{{ (i%2) ? i : ''}}{{/numbers}}", {numbers:[{i:11},{i:22},{i:33}]}) == "1133"; `


### Conditionals
`{{#total>0}}` | `{{^total>0}}` | `{{#section=="home"}}` <br />
This is a big piece of functionality missing from Mustache.js, and can be quite helpful when constructing views. If the expression returns falsy, the contents are ommited. If the expression is truthy, the contents are included/executed. This can help add "active" classes to navigation and show/hide sections content according to task/location/time/etc. Logic in the template allow declarative view definition and eliminates the need for DOM-binding to achieve view updates.
<br /> ex: ` nostache("i is {{#i > 5}}big{{/i > 5}}{{#i<6}}small{{/i<6}}", {i: 2}) == "i is small"; `
<br /> ex: ` nostache("i is {{#i > 5}}big{{/i > 5}}{{#i<6}}small{{/i<6}}", {i: 9}) == "i is big"; `

### {{!path}} else syntax
`{{!path}}` turns into `{{/path}}{{^path}}`, for simpler _else_ handling of regular mustache conditionals.
<br /> ex: ` nostache("{{#i}}yes{{!i}}no{{/i}}", {i: 9}) == "yes"; `
<br /> ex: ` nostache("{{#i}}yes{{!i}}no{{/i}}", {i: 0}) == "no"; `
    
    


### Razor Syntax
`@lname, @fname` | ` @#users  @INDEX: @name  @/users` <br />
"Inspired" by MS's VS/MVC razor templates, this alternative syntax can keep visual boilerplate costs down. You can use it for injection, looping, and conditionals, but the allowed characters are more restricted that the traditional `{{}}` delimiters (`\w\.$|`) , so it's not the best choice for complex logic. Lastly, it avoids mistaking email addresses for tokens by insisting upon a non-wordy char to the left of the `@`.
<br /> ex: ` nostache("Hello @name", {name: "Fred"}) == "Hello Fred"; `
<br /> ex: ` nostache("Chars: @name.length", {name: "Fred"}) == "Chars: 4"; `
<br /> ex: ` nostache("Hello @user.name", { user: {name: "Fred"} }) == "Hello Fred"; `



### {{INDEX}}
  Simple "contstant" that returns the current index when iterating an Array.  <br />
<br /> ex: ` nostache("{{.numbers}}{{INDEX}}:{{.}} {{/numbers}}", {numbers:[11,22,33]}) == "1:11 2:22 3:33 "; `


### {{SEP}} mini-section
   Simple "constant" that returns the enclosed block for every value except for the last. 
<br /> ex: ` nostache("{{.numbers}}{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) == "11, 22, 33"; `


### {{__.key}} root syntax
`{{__.key}}` reaches _key_ on the data object given to nostache, bypassing local conflicts. 
<br /> ex:  `nostache('{{.b}}{{a}}|{{__.a}} {{/b}}', {a:123, b:[{a:1}]} ) == "1|123 ";`


### {{#obj:key}} object iteration
 Iterates over objects using a placeholder name on the section tag, prefixed by ":". <br />
 Inside the section, the key as a tag will equal the name of the object property's key, and `.` will equal the property value.
<br /> ex:  `nostache('{{.a:k}}{{k}}: {{.}} {{/a:k}}', {a:{b:1,c:5}}) == "b: 1 c: 5 ";`





