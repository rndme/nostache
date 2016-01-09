console.log({ // nostache internal unit tests. tests bare basics and extra functionality above and beyond mustache.

	basic:		nostache("Hello {{this.name}}", {name: "Fred"}) 
	== "Hello Fred",
	
	passHTML:	nostache("Hello {{this.name}}", {name:"Fred".bold()}) 
	== "Hello <b>Fred</b>",
	
	method:		nostache("Hello {{this.name.bold()}}", {name:"Fred"}) 
	== "Hello <b>Fred</b>",
	
	inject:		nostache("Hello {{=name}}", {name:"Fred".bold()}) 
	== "Hello &lt;b&gt;Fred&lt;&#x2F;b&gt;",
	
	array:		nostache("{{#numbers}}#{{/numbers}}", {numbers:[11,22,33]}) 
	== "###",
	
	dot:		nostache("{{#numbers}}{{.}} {{/numbers}}", {numbers:[11,22,33]}) 
	== "11 22 33 ",
	
	SEP:		nostache("{{#numbers}}{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) 
	== "11, 22, 33",
	
	INDEX:		nostache("{{#numbers}}{{INDEX}}:{{.}} {{/numbers}}", {numbers:[11,22,33]}) 
	== "1:11 2:22 3:33 ",
	
	INDSEP:  	nostache("{{#numbers}}{{INDEX}}:{{.}}{{SEP}}, {{/SEP}}{{/numbers}}", {numbers:[11,22,33]}) 
	== "1:11, 2:22, 3:33",
	
	logic: 		nostache("{{#numbers}}{{ (this.i%2) ? this.i : ''}}{{/numbers}}", {numbers:[{i:11},{i:22},{i:33}]}) 
	== "1133",
	
	cond1:		nostache("i is {{?i > 5}}big{{/i > 5}}{{?i<6}}small{{/i<6}}", {i: 2}) 
	== "i is small",
	
	cond2:		nostache("i is {{?i > 5}}big{{/i > 5}}{{?i<6}}small{{/i<6}}", {i: 9}) 
	== "i is big",
	
	razorSimple:	nostache("Hello @name", {name: "Fred"}) 
	== "Hello Fred",
	
	razorProp:	nostache("Chars: @name.length", {name: "Fred"}) 
	== "Chars: 4",
	
	razorDrill:	nostache("Hello @user.name", { user: {name: "Fred"} }) 
	== "Hello Fred",
	
	else1:		nostache("{{#i}}yes{{|i}}no{{/i}}", {i: 9}) 
	== "yes",
	
	else2:		nostache("{{#i}}yes{{|i}}no{{/i}}", {i: 0}) 
	== "no",
	
	root:		nostache('{{#b}}{{a}}|{{__.a}} {{/b}}', {a:123, b:[{a:1}]} ) 
	== "1|123 ",
	
	KEY:		nostache('{{$a}}{{KEY}}: {{.}} {{/a}}', {a:{b:1,c:5}}) 
	== "b: 1 c: 5 ",
	
	SCOPE:		nostache("{{SCOPE.nick=this.name.bold(),''}} Hello {{SCOPE.nick}}", {name:"Fred"}) 
	== " Hello <b>Fred</b>",
	
	states:		[0,0,0,0].map(nostache("Hello {{=i++}}").bind(null, {i:0})).join(" ") 
	== "Hello 0 Hello 1 Hello 2 Hello 3",
	
});
