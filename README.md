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
`{{name}}`


### Imports
`{{>name}}`


### Conditionals
`{{#total>0}}` or NOT: `{{^total>0}}`


### Looping
`{{.users}}`


### Razor Syntax
`@lname, #fname`











