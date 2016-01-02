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
`{{name}}` | `{{root.branch.sub.name.prop}}` | `{{user['name']}}` | `{{name.bold()}}`  <br />
Inserts the value of the named path. Unlike Mustache, you can use bracket notation and invoke methods inline, even passing arguments to methods via primitives or _imports_.

### Imports
`{{>name}}`
Imports use the same syntax, but work slightly differently than Mustache's partials. Whereas Mustache partials are executed in-flow and with surrounding context, Nostache imports run globally just prior to templating. Global (flat) processing executes much faster than Mustache's, but also means that Nostache imports cannot import other imports. All imported values should be directed properties of the _partials_ object (no nested sub-objects). You can omit the _partials_ object at call-time, which triggers import resolution to look at the _this_ object instead, which allows a handy way to bind() a set of resources to a rendering function. As they execute, imports simply replace literal text, with no consideration of context or validity. This is a good thing because you can inject template code, and it will get executed as though it were hard-coded, providing a macro-like stage of code execution.

### Conditionals
`{{#total>0}}` | `{{^total>0}}`


### Looping
`{{.users}}`


### Razor Syntax
`@lname, #fname`











