define([
	'lib/delegate'
], function(delegate){
	var place = dojo.place;
	var query = dojo.query;

	// event delegation: event on selector -> method

	var Mixins = {};

	Mixins.Events = {};
	Mixins.Events.bindings = function(bindings){
		for (selector in bindings){ if (bindings.hasOwnProperty(selector)){ var events = bindings[selector];
			var node = query(selector, this.containerNode);
			for (event in events){ if (events.hasOwnProperty(event)){ var handler = events[event];
				node.connect(event, this, handler);
			}}
		}}
	};

	// data binding: model -> view
	Mixins.Data = {
		_validations: {},
		bindObjToDom: function(resource, setters){
			var root = this.containerNode;
			var rebind = function(){
				var object = resource.properties;
				for (key in setters){ if (setters.hasOwnProperty(key)){ var setter = setters[key];
					// We check whether the root node has the given class or query its children
					var node = dojo.hasClass(root, key) ? root : query('.' + key, root);
					var value = typeof resource[key] === 'function' ? resource[key].call(object, resource) : object[key];
					typeof value !== 'undefined' && setter(node, value);
				}}
			};
			var handle = resource.delegate({ changed: rebind });

			// I now stored the binding references as a data attribute which in some way seems fine
			// since it is related to the DOM node where the binding is applied on.
			// We are getting the existing bindings from the DOM node and then add the new binding
			// reference.

			// Still should check whether this is the way we want to go.

			var b = dojo.attr(this.containerNode, 'data-bindings');
			b = b ? dojo.fromJson(b) : {};
			!b[resource._uuid] && (b[resource._uuid] = []);
			b[resource._uuid].push(handle);
			dojo.attr(this.containerNode, 'data-bindings', dojo.toJson(b));
			rebind();
		},
		unbindObjFromDom: function(resource){
			var bindings = dojo.attr(this.containerNode, 'data-bindings');
			if (bindings){
				bindings = dojo.fromJson(bindings);
				bindings[resource._uuid] && dojo.forEach(bindings[resource._uuid], function(handle){
					resource.removeDelegate(handle);
				});
				delete bindings[resource._uuid];
				dojo.attr(this.containerNode, 'data-bindings', dojo.toJson(bindings));
			}
		},
		validate: function(resource){
			var handle = resource.delegate({
				'error': dojo.hitch(this, function(err){
					this.clearValidation();
					var type, str;
					for (type in err){
						str = err[type].pop();
						dojo.query('.error-'+type, this.containerNode).attr('innerHTML', str);
					}
				})
			});
			if (!this._validations[resource._uuid]){
				this._validations[resource._uuid] = [];
			}
			this._validations[resource._uuid].push(handle);
		},
		unbindValidate: function(resource){
			this._validations[resource._uuid] && dojo.forEach(this._validations[resource._uuid], function(handle){
				resource.removeDelegate(handle);
			});
			delete this._validations[resource._uuid];
		},
		clearValidation: function(){
			dojo.query('.error-container', this.containerNode).attr('innerHTML', '');
		}
	};


	// template rendering
	Mixins.Template = function(domNode, template, position){
		dojo.mixin(this, {
			containerNode: dojo._toDom(template),
			domNode: domNode,
			template: template,
			position: position
		});
	};

	Mixins.Template.prototype.render = function(){
		place(this.containerNode, this.domNode, this.position);
	};

	return Mixins;
});
