define([
	'lib/delegate'
], function(delegate){
	var hitch = dojo.hitch;
	var mixin = dojo.mixin;
	var xhr = dojo.xhr;

	var Resource = function(name){
		if (typeof name === 'undefined'){
			throw new Error('`name` is required for Resource.');
		}

		if (!(this instanceof Resource)){
			return new Resource(name);
		}

		this.url = '/api/v1/' + name + '/';
	};

	Resource.prototype = {
		create: function(obj){
			// Creating a deferred because ioArgs is undefined in Dojos xhr implementation - see #12126
			var deferred = new dojo.Deferred();
			this.jsonXhr('POST', this.url, obj, hitch(this, function(response, ioArgs){
				var id = ioArgs.xhr.getResponseHeader('Location').match(/\/(\d+)\/$/)[1];
				this.get(id).then(function(object){
					deferred.callback(object);
				});
			}), function(error, ioArgs){
				deferred.errback(ioArgs.xhr ? dojo.fromJson(ioArgs.xhr.responseText) : {});
			});
			return deferred;
		},
		destroy: function(id){
			return this.jsonXhr('DELETE', this.objectUrl(id));
		},
		get: function(id){
			return this.jsonXhr('GET', this.objectUrl(id));
		},
		jsonXhr: function(method, url, obj, load, error){
			return xhr(method, {
				error: error,
				failOk: true,
				handleAs: 'json',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				load: load,
				postData: obj && dojo.toJson(obj),
				url: url
			});
		},
		list: function(query){
			return this.jsonXhr('GET', this.listUrl(query)).then(function(response){
				return response.objects;
			});
		},
		listUrl: function(query){
			return this.url + (query ? '?' + dojo.objectToQuery(query) : '');
		},
		objectUrl: function(id){
			return this.url + id + '/';
		},
		update: function(id, obj){
			// Creating a deferred because ioArgs is undefined in Dojos xhr implementation - see #12126
			var deferred = new dojo.Deferred();
			this.jsonXhr('PUT', this.objectUrl(id), obj, hitch(this, function(response, ioArgs){
				this.get(id).then(function(object){
					deferred.callback(object);
				});
			}), function(error, ioArgs){
				deferred.errback(ioArgs.xhr ? dojo.fromJson(ioArgs.xhr.responseText) : {});
			});
			return deferred;
		}
	};

	return Resource;
});
