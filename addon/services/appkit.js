import Ember from 'ember';

export default Ember.Service.extend({
	host: "",
	apiPrefix: "",
	apiUrl: "",

	intialize: Ember.on("init", function() {
		this._super.apply(arguments);

		var ENV = this.container.lookupFactory("config:environment");

		if (!ENV.appkitHost) {
			console.log("Warning: config.ENV.appkitHost is not set. Defaulting to http://localhost:8000");
		}
		var host = ENV.appkitHost || "http://localhost:8000";
	
		if (!ENV.appkitApiPrefix) {
			console.log("Warning: config.ENV.appkitApiPrefix is not set. Defaulting to /api");
		}
		var apiPrefix = ENV.appkitApiPrefix || "api";	

		var url =  host + "/" + apiPrefix

		this.setProperties({
			host: host,
			apiPrefix: apiPrefix,
			apiUrl: url
		});
	}),

	method: function(name, data) {
		var apiUrl = this.get("apiUrl");

		data = data || {};
		if (!("data" in data)) {
			data = {data: data};
		}

		return new Ember.RSVP.Promise(function(resolve, reject) {
			 Ember.$.ajax({
				method: "POST",
				url: apiUrl + "/method/" + name,
				contentType: "application/json",
				data: JSON.stringify(data),
				dataType: "json"
			}).then(function(data) {
				resolve(data);
			}, function(data) {
				reject(data.responseJSON, data);
			});
		});
	}
});
