require([
	'lib/json_resource',
	'views/page'
], function(resource, pageView){
	var forEach = dojo.forEach;
	var pageView = new pageView();


	// Global helpers
	var valueToAttr = function(attr){
		return function(node, value){
			node.attr(attr, value);
		}
	};

	window.into = {
		html: valueToAttr('innerHTML'),
		src: valueToAttr('src'),
		value: valueToAttr('value')
	};
})
