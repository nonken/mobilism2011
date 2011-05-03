define([
	'lib/delegate',
	'lib/mixins'
], function(delegate, mixins){
	var mixin = dojo.mixin;

	var Item = function(item, domNode){
		this.item = item;

		mixin(this, new mixins.Template(domNode, '<tr><td class="time"></td><td class="track"><div class="title"></div><div class="speaker"></div></td></tr>'));
		mixin(this, mixins.Data);
		mixin(this, mixins.Events);

		// Binding objecs to DOM node
		this.bindObjToDom(item, {
			title: into.html,
			time: into.html,
			speaker: into.html
		});

		this.bindings({
			'.speaker': {
				click: 'change'
			}
		});

		this.render();
	};

	Item.prototype = {
		change: function(){
			this.item.set({
				speaker: 'Dude'
			});
			this.item.update();
		}
	}

	return Item;
});
