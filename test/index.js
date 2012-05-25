var XMLSerializer = require('xmldom').XMLSerializer;
var DOMParser = require('xmldom').DOMParser;
try{
	var libxml = require('libxmljs');
}catch(e){
	var DomJS = require("dom-js");
}

var assert = require('assert');
var oldParser = DOMParser.prototype.parseFromString ;
function format(s){
	if(libxml){
		var result = libxml.parseXmlString(s).toString();
	}else{
		var domjs = new DomJS.DomJS();
		domjs.parse(s, function(err, dom) {
	  	  result = dom.toXml();
		});
	}
	return result;
}
DOMParser.prototype.parseFromString = function(data){
	var doc = oldParser.apply(this,arguments);
	var domjsresult = format(data);
	var xmldomresult = new XMLSerializer().serializeToString(doc);
	xmldomresult = xmldomresult.replace(/^<\?.*?\?>|<!\[CDATA\[\]\]>/g,'')
	domjsresult = domjsresult.replace(/^<\?.*?\?>|<!\[CDATA\[\]\]>/g,'')
	assert.equal(xmldomresult,domjsresult);
	return doc;
}

require('./dom');
require('./parse-element');
require('./node');
require('./namespace');
//require('./big-file-performance');