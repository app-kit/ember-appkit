import Ember from 'ember';

export default Ember.Service.extend({
	host: "",
	apiPrefix: "",
	apiUrl: "",
	realm: "",

	autobahnSession: null,

	sessionToken: null,
	currentUser: null,
	currentUserId: null,

	session: Ember.inject.service("session"),
	store: Ember.inject.service("store"),

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

		let realm = ENV.appkitRealm || "appkit";

		// Try to initialize autobahn.js.
		let autobahnCon = new autobahn.Connection({
			url: url.replace("http://", "ws://") + "/wamp", 
			realm: realm,
		});
		autobahnCon.onopen = (session, details) => {
			console.log("Autobahn connection established");
			this.set("autobahnSession", session);

			// Try to resume session if possible.
			if (this.get("sessionToken")) {
				this.resumeSession(this.get("sessionToken"));
			}
		};
		autobahnCon.onclose = (reason, details) => {
			console.log("Autobahn connection closed: ", reason, details);
			this.set("autobahnSession", null);
		};
		autobahnCon.open();

		this.setProperties({
			host: host,
			apiPrefix: apiPrefix,
			apiUrl: url,
		});
	}),

	_ajax(options) {
		options =  Ember.$.extend({
			method: "POST",
			contentType: "application/json",
			dataType: "json",
		}, options);

		if (options.method !== "GET" && options.data && typeof options.data !== "string") {
			options.data = JSON.stringify(options.data);
		}

		// If the session is authenticated, add an Authentication header.
	    let token = this.get("sessionToken");
	    if (token) {
	      options.headers = options.headers || {};
	      options.headers.Authentication = token;
	    }

	    return Ember.$.ajax(options);
	},

	authenticate(adaptor, authData, userIdentifier) {
		let appkit = this;

		let data = {
			adaptor: adaptor,
			"auth-data": authData,
			user: userIdentifier,
		};

		return new Ember.RSVP.Promise(function(resolve, reject) {
			appkit.method("users.authenticate", data).then(function(response) {
				let store = appkit.get("store");

				let token = response.data.id;
				
				// Since we do not want to push the session into the store, 
				// we replace the session with the user.
				var userIndex = -1;
				response.included.forEach(function(item, index) {
					if (item.type === "users") {
						userIndex = index;
						return false;
					}
				});

				let userData = response.included.splice(userIndex, 1)[0];
				let payload = {
					data: userData,
					included: response.included,
				}

				let userId = payload.data.id;

				store.pushPayload(payload);

				appkit.setProperties({
					sessionToken: token,
					currentUserId: userId,
					currentUser: store.peekRecord("user", userId),
				});

				resolve({token: token});
			}, function(data) {
				reject(data);
			});
		});
	},

	resumeSession(token) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			this.method("users.resume_session", {token: token}).then(data => {
				let store = appkit.get("store");

				let token = response.data.id;
				
				// Since we do not want to push the session into the store, 
				// we replace the session with the user.
				var userIndex = -1;
				response.included.forEach(function(item, index) {
					if (item.type === "users") {
						userIndex = index;
						return false;
					}
				});

				let userData = response.included.splice(userIndex, 1)[0];
				let payload = {
					data: userData,
					included: response.included,
				}

				let userId = payload.data.id;

				store.pushPayload(payload);

				appkit.setProperties({
					sessionToken: token,
					currentUserId: userId,
					currentUser: store.peekRecord("user", userId),
				});

				resolve({token: token});
			}, data => {
				reject(data);
			});

			this._ajax({
				url: this.get("apiUrl") + "/sessions/" + token,
				method: "GET"
			}).then(data => {
				let token = data.data.id;
				let user = data.meta ? data.meta.user : null;
				let profile = data.meta ? data.meta.profile : null;

				if (user) {
					user.profile = profile;
				}

				this.setProperties({
					sessionToken: token,
					currentUser: user,
					currentUserId: user ? user.id : null,
				});

				resolve({token: token});
			}, data => {
				reject(data);
			});
		});
	},

	endSession(token) {
		return this._ajax({
			url: this.get("apiUrl") + "/sessions/" + token,
			method: "DELETE",
		}).then(data => {
			this.setProperties({
				sessionToken: null,
				currentUser: null,
				currentUserId: null,
			});
		});
	},

	signInWithEmail(user, password) {
		return this.container.lookup('session:main').authenticate("authenticator:appkit", {
			user: user,
			adaptor: "password",
			"auth-data": {password: password},
		});
	},

	signInWithOauth(service, token) {
		return this.container.lookup('session:main').authenticate("authenticator:appkit", {
			adaptor: "oauth",
			"auth-data": {
				service: service,
				access_token: token,
			},
		});
	},

	signInOrUpWithOauth(service, token, userData) {
		return this.signInWithOauth(service, token).then(null, data => {
			// Login failed. try to sign up.
			return this.signUp("oauth", {service: service, access_token: token}, userData);
		})
	},

	signUp(adaptor, authData, data) {
		return this._ajax({
			method: "POST",
			url: this.get("apiUrl") + "/users",
			data: {
				data: {
					type: "users",
					attributes: data
				},
				meta: {
					adaptor: adaptor,
					"auth-data": authData
				}
			}
		}).then(() => {
			let loginData = {
				adaptor: adaptor,
				"auth-data": authData
			};

			if (adaptor === "password") {
				loginData.user = data.email;		
			}

			return this.container.lookup('session:main').authenticate('authenticator:appkit', loginData);
		});
	},

	signUpWithEmail(email, password) {
		return this.signUp("password", {"password": password}, {email: email});
	},

	requestPasswordReset(user) {
		return this.method("users.request-password-reset", {user: user});	
	},

	resetPassword(token, password) {
		return this.method("users.password-reset", {
			token: token, 
			password: password
		});
	},

	methodAutobahn(name, data) {
		let session = this.get("autobahnSession");

		return new Ember.RSVP.Promise(function(resolve, reject) {
			console.log("Calling autobahn method: ", name);
			session.call(name, [], data).then(function(result) {
				let data = result.kwargs;

				if (data.errors && data.errors.length) {
					reject(data);
				} else {
					resolve(data);
				}
			}, function(error) {
				reject(error);
			});	
		});
	},

	method(name, data) {
		data = data || {};
		if (!("data" in data)) {
			data = {data: data};
		}

		if (this.get("autobahnSession")) {
			return this.methodAutobahn(name, data);
		}

		var apiUrl = this.get("apiUrl");

		let appkit = this;

		return new Ember.RSVP.Promise(function(resolve, reject) {
			 appkit._ajax({
				url: apiUrl + "/method/" + name,
				data: data,
			}).then(function(data) {
				if (data.errors && data.errors.length) {
					reject(data);
				} else {
					resolve(data);
				}
			}, function(data) {
				reject(data.responseJSON, data);
			});
		});
	}
});
