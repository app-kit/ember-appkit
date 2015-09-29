import Ember from "ember";
import Base from 'ember-simple-auth/authenticators/base';
import ENV from "appkit-admin/config/environment";

export default Base.extend({

  restore: function(data) {
		var apiUrl = ENV.appkitHost + ENV.appkitApiPrefix;
		if (!apiUrl) {
			throw new Error("config.appkitHost is not set");
		}
		
  	return new Ember.RSVP.Promise(function(resolve, reject) {

      Ember.$.ajax({
			  type: "GET",
			  url: apiUrl + "/sessions/" + data.token,
			  dataType: "json"
			}).then(function(newData) {
				resolve({
					token: data.token,
					user: newData.meta.user,
					profile: newData.meta.profile
				});
			}, function(xhr) {
				reject(xhr.responseJSON || xhr.responseText);
			});
    });
  },

  authenticate: function(options) {
  	var apiUrl = ENV.appkitHost + ENV.appkitApiPrefix;
		if (!apiUrl) {
			throw new Error("config.appkitHost is not set");
		}

  	if (!options.adaptor) {
  		throw new Error("No adaptor specified in authenticate options");
  	}
  	if (typeof options["auth-data"] !== "object") {
  		throw new Error("No auth-data specified in authenticate options");
  	} 

  	var data = {
  		data: {attributes:{}},
  		meta: {
  			user: options.user,
  			adaptor: options.adaptor,
  		}
  	};
  	data.meta["auth-data"] = options["auth-data"];

  	return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
			  type: "POST",
			  url: apiUrl + "/sessions",
			  data: JSON.stringify(data),
			  contentType: "application/json",
			  dataType: "json"
			}).then(function(data) {
				if (typeof data.data !== "object") {
					reject("Invalid response data");
				}
				var token = data.data.id;

				if (!token) {
					reject("No token in data");
				}

				resolve({
					token: token,
					user: data.meta.user,
					profile: data.meta.profile
				});
			}, function(xhr) {
				var data = xhr.responseJSON;

				if (data && data.errors) {
					var err = data.errors[0];
					reject(err.message || err.code);
				}

				reject(xhr.responseText);
			});
    });
  },

  invalidate: function(data) {
  	var apiUrl = ENV.appkitHost + ENV.appkitApiPrefix;
		if (!apiUrl) {
			throw new Error("config.appkitHost is not set");
		}

  	return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
			  type: "DELETE",
			  url: apiUrl + "/sessions/" + data.token,
			  dataType: "json"
			}).then(function() {
				resolve();	
			}, function() {
				resolve();
			});
    });
  }

});
