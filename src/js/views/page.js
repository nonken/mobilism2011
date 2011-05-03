define([
	'views/item',
	'models/models'
], function(Item, models){
	var
		forEach = dojo.forEach,
		byId = dojo.byId,
		hitch = dojo.hitch
	;

	var Page = function(items){
		this.domNode = byId('page');

		this.items = new models.Items;
		this.items.delegate({
			'list': hitch(this, 'add')
		});
		this.items.list();
	};

	Page.prototype = {
		add: function(items){
			forEach(items, function(item){
				new Item(item, this.domNode);
			}, this);
		}
	};

	return Page;
});
