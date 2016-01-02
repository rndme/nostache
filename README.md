# nostache
## mustache.js-like templates w/ a tiny ES6 core

## usages
Pass one argument (a string template) to return a function that returns an HTML string when passed an object:
`fn=nostache(strTemplate); 
strOutput=fn(object);`

Pass two arguments ( a string template and an object of data) to invoke immediately:
`strOutput=nostache(strTemplate, object);`


## differences from core mustache:
 `{{#name}}` is always a conditional, use `{{.name}}` to iterate arrays

## additions to core mustache:
 -modelled on mostache, https://github.com/rndme/mostache/, 

## removals from mostache:
* macro mode (use ES6 for macros instead:  `{{#sections.${activeSection}}}`)
* object iteration syntax (NA)
* native method detection (not needed, adds run-time complexity; use parens to invoke methods)
* |helpers  (not needed, methods can be invoked in-template `{{name.bold()}}` )
* __.root  (not practical with a context-less transformer)

## additions/changes to mostache
* `{INDEX}` is now `{{INDEX}}`, which is more consistent with the syntax
* `{SEP}, {/SEP}` is now `{{SEP}}, {{/SEP}}`, which is more consistent
* uses `==` instead of `=` and quoted string literals to compare  `{{#sec=="main"}}`
* long paths work in comparing conditionals  `{{#sec.a.length==3}}`
* any expression can compare, not just equals  `{{#sec.a.length>3}}` or, conversely  `{{^sec.a.length>3}}`
* razor mode is auto-activated, special `{{@@}}` token not needed


## Features

### Injection
`{{name}}` | `{{root.branch.sub.name.prop}}` | `{{user['name']}}` | `{{name.bold()}}` | `{{++this['total'] * 10 }}` <br />
Inserts the value of the named path. Unlike Mustache, you can use bracket notation and invoke methods inline, even passing arguments to methods via primitives or early-run _imports_. You can perform calculations mid-expression using virtually any valid javascript expression. You can reach not only in-scope variables, but globals like `Math.random()` as well. Also keep in mind that you can use ES6 template strings to inject dynamic values into the template before it executes.

### Imports
`{{>name}}`
Imports use the same syntax, but work slightly differently than Mustache's partials. Whereas Mustache partials are executed in-flow and with surrounding context, Nostache imports run globally just prior to templating. Global (flat) processing executes much faster than Mustache's, but also means that Nostache imports cannot import other imports. All imported values should be directed properties of the _partials_ object (no nested sub-objects). You can omit the _partials_ object at call-time, which triggers import resolution to look at the _this_ object instead, which allows a handy way to bind() a set of resources to a rendering function. As they execute, imports simply replace literal text, with no consideration of context or validity. This is a good thing because you can inject template code, and it will get executed as though it were hard-coded, providing a macro-like stage of code execution.


### Looping
`{{.users}}`
Loops Traverse data Arrays and repeat their content for each element in the Array.
Due to the simplicity of the engine, there is on one restriction on nested looping: you cannont have a duplicated property name iterated on different nested levels; eg. `{users:{users:[1,2,3]}}` is no good.


### Conditionals
`{{#total>0}}` | `{{^total>0}}`
This is a big piece of functionality missing from Mustache.js, and can be quite helpful when constructing views.


### Razor Syntax
`@lname, @fname` | ` @#users  @INDEX: @name  @/users`
"Inspired" by MS's VS/MVC razor templates, this alternative syntax can keep visual boilerplate costs down. You can use it for injection, looping, and conditionals, but the allowed characters are more restricted that the traditional `{{}}` delimiters, so it's not the best choice for conplex logic. Lastly, it avoids mistaking email addresses for tokens by insisting upon a non-wordy char to the left of the `@`.










