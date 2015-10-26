import Ember from 'ember';

export default Ember.Service.extend({
	userId: null,
	user: null,
	isAuthenticated: false,

	store: Ember.inject.service("store"),

	appkit: null,

	intialize: Ember.on("init", function() {
		this._super.apply(arguments);

		let ENV = this.container.lookupFactory("config:environment");
		let options = ENV.appkit || {};
		this.appkit = new Appkit.Appkit(options);

		// Install session_changed handler.
		this.appkit.on("session_changed", session => {
			this.set("isAuthenticated", session.isAuthenticated());
			this.set("userId", session.userId);

			let userData = session.userData;
			if (userData) {
				userData.type = "user";
				this.set("user", this.get("store").push(userData));
			} else {
				this.set("user", null);
			}

			console.log(session, typeof this.get("user"), this.get("user"))
		});
	}),

	method(name, data, serializer) {
		return this.appkit.method(name, data, serializer);
	},

	authenticate(adaptor, authData, user) {
		return this.appkit.authenticate({
			adaptor: adaptor,
			authData: authData,
			user: user,
		});
	},

	authenticateWithPassword(userIdentifier, password) {
		return this.appkit.authenticateWithPassword(userIdentifier, password);
	},

	authenticateWithOauth(service, token) {
		return this.appkit.authenticateWithOauth(service, token);
	},

	authenticateOrSignUpUpWithOauth(service, token, userData) {
		return this.signInWithOauth(service, token).then(null, data => {
			// Login failed. try to sign up.
			return this.appkit.signUpWithOauth(service, token, userData);
		});
	},

	unauthenticate() {
		return this.appkit.unauthenticate();
	},

	signUp(user, authOptions) {
		return this.appkit.signUp(user, authOptions);	
	},

	signUpWithPassword(email, password, username) {
		return this.appkit.signup(email, password, username);
	},

	requestPasswordReset(user) {
		return this.appkit.requestPasswordReset(user);
	},

	resetPassword(token, newPassword) {
		return this.appkit.resetPassword(token, newPassword);
	},
});
