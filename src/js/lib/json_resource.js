// JSONFileResource
define(function(){
	return {
		list: function(){
			return dojo.xhrGet({
				url: 'data/schedule.json',
				handleAs: 'json'
			}).then(function(data){
				return data.objects;
			});
		}
	};
});