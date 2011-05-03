define([
	'lib/delegate',
	'lib/json_resource'
], function(delegate, Resource){
	var each = dojo.forEach;
	var hitch = dojo.hitch;
	var map = dojo.map;
	var mixin = dojo.mixin;

	//
	// MODELS
	// -> model.js
	//

	var Model = function(resource){
		if (!(this instanceof Model)){
			return new Model(resource);
		}

		mixin(this, delegate());

		mixin(this, {
			properties: {},
			resource: resource
		});
	};

	Model.prototype = {
		destroy: function(){
			this.emit('destroyed');
		},
		get: function(){
			return this.properties;
		},
		refresh: function(){
			this.emit('changed');
		},
		save: function(){
			this.emit('changed');
		},
		set: function(properties){
			mixin(this.properties, properties);
		},
		update: function(){
			this.emit('changed');
		}
	};

	//
	// CONCRETE MODELS
	// -> models/NAME.js
	//

	var Item = function(properties){
		mixin(this, Model(Resource));

		this.set(properties);
	};

	//
	// COLLECTIONS
	// -> collection.js
	//

	var Collection = function(model, resource){
		if (!(this instanceof Collection)){
			return new Collection(model, resource);
		}

		mixin(this, delegate());
		mixin(this, {
			model: model,
			resource: resource
		});
	};

	Collection.prototype = {
		list: function(query, options){
			var self = this;
			this.resource.list(query).then(function(objects){
				self.emit('list', map(objects, function(object){
					return self.add(new self.model(object));
				}));
			});
		},
		add: function(object){
			object.delegate({
				created: hitch(this, function(object){ this.emit('created', object); }),
				updated: hitch(this, function(object){ this.emit('updated', object); }),
				destroyed: hitch(this, function(object){ this.emit('destroyed', object); })
			});
			this.emit('added', object);
			return object;
		}
	};

	//
	// CONCRETE COLLECTIONS
	// -> collections/NAME.js
	//

	var Items = function(){
		mixin(this, Collection(Item, Resource));
	};

	return {
		Item: Item,
		Items: Items
	};
});
