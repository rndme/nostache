# nostache
### mustache.js-like templates w/ a tiny ES6 core

## Design
A pre-compile-able 1kb engine that does what mustache does, and with extra declartive-view features. <br />
To get all geeky: A RegExp-based 1-pass top-down transpiler (with imports) constructs a JIT ES6 template string that evaluates the embeded exressions. The only late-run code is for looping and `{{INDEX}}` expressions, everything else is pure string processing, which makes it easy to reason about and fork for customized applications.



## Usage
#### (a string template) to return a function that returns an HTML string when passed an object: <br />
`fn=nostache(strTemplate); 
strOutput=fn(object);`

#### (a string template and object of data) to invoke immediately:<br />
`strOutput=nostache(strTemplate, object);`

#### (a string template, object of data, and object of partials/imports) :
`strOutput=nostache(strTemplate, objData/null, objPartials);` Pass null to get a function, data to get a rendered string.


## Syntax Features

### Injection
`{{name}}` | `{{root.branch.sub.name.prop}}` | `{{user['name']}}` | `{{name.bold()}}` | `{{++this['total'] * 10 }}` <br />
Inserts the value of the named path. Unlike Mustache, you can use bracket notation and invoke methods inline, even passing arguments to methods via primitives or early-run _imports_. You can perform calculations mid-expression using virtually any valid javascript expression. You can reach not only in-scope variables, but globals like `Math.random()` as well. Also keep in mind that you can use ES6 template strings to inject dynamic values into the template before it executes.

### Imports
`{{>name}}` <br />
Imports use the same syntax, but work slightly differently than Mustache's partials. Whereas Mustache partials are executed in-flow and with surrounding context, Nostache imports run globally just prior to templating. Global (flat) processing executes much faster than Mustache's, but also means that Nostache imports cannot import other imports. All imported values should be directed properties of the _partials_ object (no nested sub-objects). You can omit the _partials_ object at call-time, which triggers import resolution to look at the _this_ object instead, which allows a handy way to bind() a set of resources to a rendering function. As they execute, imports simply replace literal text, with no consideration of context or validity. This is a good thing because you can inject template code, and it will get executed as though it were hard-coded, providing a macro-like stage of code execution.


### Looping
`{{.users}}` <br />
Loops Traverse data Arrays and repeat their content for each element in the Array.
Due to the simplicity of the engine, there is on one restriction on nested looping: you cannont have a duplicated property name iterated on different nested levels; eg. `{users:{users:[1,2,3]}}` is no good.


### Conditionals
`{{#total>0}}` | `{{^total>0}}` | `{{#section=="home"}}` <br />
This is a big piece of functionality missing from Mustache.js, and can be quite helpful when constructing views. If the expression returns falsy, the contents are ommited. If the expression is truthy, the contents are included/executed. This can help add "active" classes to navigation and show/hide sections content according to task/location/time/etc. Logic in the template allow declarative view definition and eliminates the need for DOM-binding to achieve view updates.


### Razor Syntax
`@lname, @fname` | ` @#users  @INDEX: @name  @/users` <br />
"Inspired" by MS's VS/MVC razor templates, this alternative syntax can keep visual boilerplate costs down. You can use it for injection, looping, and conditionals, but the allowed characters are more restricted that the traditional `{{}}` delimiters (`\w\.$|`) , so it's not the best choice for complex logic. Lastly, it avoids mistaking email addresses for tokens by insisting upon a non-wordy char to the left of the `@`.


### {{INDEX}}
  Simple "contstant" that returns the current index when iterating an Array.  <br />
    `{{#persons}}<li> #{{INDEX}}. {{firstName}} {{lastName}} </li> {{/persons}}`


### {{SEP}} mini-section
   Simple "constant" that returns the enclosed block for every value except for the last. <br />
    `{{SEP}} <br /> {{/SEP}}` |  `{{SEP}}, {{/SEP}}`


### {{!path}} else syntax
  `{{!path}}` turns into `{{/path}}{{^path}}`, for simpler _else_ handling. <br />
    `<p>{{#ok}}Y{{!ok}}N{{/ok}}</p>` == `<p>{{#ok}}Y{{/ok}}{{^ok}}N{{/ok}}</p>`
    








