import Ember from 'ember';

export default Ember.Service.extend({

	initialized: false,
	loginStatus: null,
	token: null,

	initialize(version, xfbml) {
		let initialized = this.get("initialized");
		if (initialized) {
			return this.getLoginStatus();
		}

		version = version || "v2.5";

		let config = this.container.lookupFactory("config:environment");
		if (!config.facebookAppId) {
			throw new Error("config.facebookAppId not set");
		}

		let appId = config.facebookAppId;
		let component = this;

		return new Ember.RSVP.Promise(function(resolve, reject) {
			// Not initialized yet. Set up the sdk.

			window.fbAsyncInit = function() {
				console.log("Initializing Facebook SDK.")
		    FB.init({
		      appId: appId,
		      xfbml: !!xfbml,
		      version: version
		    });

		    FB.getLoginStatus(function(response)  {
		    	console.log("Retrieved Facbook login status.");
		    	component.setProperties({
		    		initialized: true,
		    		loginStatus: response.status,
		    		token: response.authResponse ? response.authResponse.accessToken : null,
		    	});
		    	resolve(response);
		    });
		  };

		  Ember.$.ajax({
				type: "GET",
				url: document.location.protocol + '//connect.facebook.net/en_US/sdk.js' ,
				success: function() {
					console.log("Loaded Facebook scripts.")
				},
				dataType: "script",
				cache: true
			});
		});

	},

	getLoginStatus() {
		if (this.get("initialized")) {
			let component = tis;

			return new Ember.RSVP.Promise(function(resolve, reject) {
				FB.getLoginStatus(function(response) {
					component.setProperties({
		    		loginStatus: response.status,
		    		token: response.authResponse ? response.authResponse.accessToken : null,
		    	});
					resolve(response);
				});
			});
		} else {
			return this.initialize();
		}
	},

	login(options) {
		if (!this.get("initialized")) {
			return this.initialize().then(response => {
				return this.login(options);
			});
		}

		let component = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			FB.login(function(response) {
				component.setProperties({
	    		loginStatus: response.status,
	    		token: response.authResponse ? response.authResponse.accessToken : null,
	    	});
	    	resolve(response);
			}, options);
		});
	},

	api(path, method, params) {
		if (!(this.get("initialized"))) {
			return this.initialize().then(() => {
				return this.api(path, method, params);
			});
		}

		return new Ember.RSVP.Promise(function(resolve, reject) {
			FB.api(path, method, params, function(response) {
				resolve(response);
			});
		});
	}

});
