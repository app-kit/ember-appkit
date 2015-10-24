import Ember from 'ember';
import layout from "./template";

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

export default Ember.Component.extend({
	layout: layout,

	appkit: Ember.inject.service("appkit"),
	fb: Ember.inject.service("facebook"),

	page: "overview",

	loading: false,
	errors: null,

  user: "",
	password: "",

	reset: null,
	resetter: Ember.observer("reset", function() {
		this.setProperties({
			page: "overview",
		});
	}),

	didInsertElement() {
		this.setProperties({
			page: "overview",
			errors: null
		});
	},

	actions: {
		show(page) {
			this.setProperties({
				errors: null,
				page: page,
			})
		},

		signInEmail() {
			let email = this.get("email");
			let pw = this.get("password");

			let el = Ember.$(this.get("element"));

			var errors = [];

			if (!validateEmail(email)) {
				el.find(".form-group-email").addClass("has-error");
				errors.push("Please specify a valid email.");
			} else {
				el.find(".form-group-email").removeClass("has-error");
			}

			if (!pw) {
				el.find(".form-group-password").addClass("has-error");
				errors.push("Please enter your password");
			} else {
				el.find(".form-group-password").removeClass("has-error");
			}

			if (errors.length) {
				this.set("errors", errors);
				return;
			}

			this.setProperties({
				loading: true,
				errors: null
			});

			this.get("appkit").signInWithEmail(email, pw).then(() => {
				this.setProperties({
					loading: false,
					page: "loggedIn"
				});
				this.sendAction("loggedIn");
			}, data => {
				let error = "An unknown error occurred";

				if (data && data.errors) {
					error =  data.errors[0].message ? data.errors[0].message : data.errors[0].code;
				}

				this.setProperties({
					loading: false,
					errors: [error]
				});
			});
		},

		requestPasswordReset() {
			let email = this.get("email");
			let el = Ember.$(this.get("element"));

			if (!validateEmail(email)) {
				el.find(".form-group-email").addClass("has-error");
				this.set("errors", ["Please specify a valid email."]);
				return;
			} else {
				el.find(".form-group-email").removeClass("has-error");
				this.set("errors", null);
			}

			this.set("loading", true);

			this.get("appkit").requestPasswordReset(email).then(() => {
				this.setProperties({
					loading: false,
					page: "passwordResetRequested",
				});
			},  data => {
				let err = "An unknown error occurred";
				if (data && data.errors && data.errors.length) {
					let firstErr = data.errors[0];
					err = firstErr.message || firstErr.code;
				}

				this.setProperties({
					loading: false,
					errors: [err],
				});
			});
		},

		signUpEmail() {
			let email = this.get("email");
			let pw = this.get("password");

			let el = Ember.$(this.get("element"));

			let errors = [];

			if (!validateEmail(email)) {
				el.find(".form-group-email").addClass("has-error");
				errors.push("Please specify a valid email.");
			} else {
				el.find(".form-group-email").removeClass("has-error");
			}

			if (!pw || pw.length < 6) {
				el.find(".form-group-password").addClass("has-error");
				errors.push("Please pick a password with at least 6 characters.");
			} else {
				el.find(".form-group-password").removeClass("has-error");
			}

			if (errors.length) {
				this.set("errors", errors);
				return;
			}

			this.setProperties({
				loading: true,
				errors: null
			});

			this.get("appkit").signUpWithEmail(email, pw).then(() => {
				this.setProperties({
					loading: false,
					page: "welcome"
				});
				this.sendAction("signedUp");
			}, data => {
				let error = "An unknown error occurred";

				if (data && data.errors) {
					error =  data.errors[0].message ? data.errors[0].message : data.errors[0].code;
				}

				this.setProperties({
					loading: false,
					errors: [error]
				});
			});
		},

		signUpFacebook(disableEmailCheck) {
			if (this.get("loading")) {
				return;
			}

			let appkit = this.get("appkit");

			let fb = this.get("fb");
			this.setProperties({
				page: "signUpFacebook",
				loading: true,
			});

			// Initialize facebook.
			fb.getLoginStatus().then(data => {
				this.setProperties({
					loading: false,
				});

				let that = this;

				if (data.status === "connected") {
					this.runFacebookSignup(!disableEmailCheck);
				} else {
					fb.login({scope: "public_profile,email"}).then(response => {
						if (response.status === "connected") {
							that.runFacebookSignup(!disableEmailCheck);
						} else {
							that.set("errors", ["Please authorize Happens Locally to log in."])
						}
					});
				}

			}, data => {
				this.setProperties({
					loading: false,
					errors: [data]
				});
			});

		},

		signupFacebookWithEmail() {
			let email = this.get("email");
			let el = Ember.$(this.get("element"));

			if (!validateEmail(email)) {
				el.find(".form-group-email").addClass("has-error");
				this.set("errors", ["Please specify a valid email address."]);
				return;
			} else {
				el.find(".form-group-email").removeClass("has-error");
				this.set("errors", null);
			}

			this.runFacebookSignup(false, {email: email});
		}
	},

	runFacebookSignup(checkEmail, userData) {
		let fb = this.container.lookup("service:facebook");
		let that = this;

		this.set("loading", true);

		if (checkEmail) {
			// First, check that we can get an email.

			fb.api("/me").then(data => {
				if (data.email) {
					this.runFacebookSignup(false);
				}	else {
					this.setProperties({
						loading: false,
						page: "signUpFacebookEmail"
					});
				}
			});

			return;
		}

		let appkit = this.get("appkit");
		appkit.signInOrUpWithOauth("facebook", fb.get("token"), userData).then(() => {
			that.setProperties({
				loading: false,
				page: "loggedIn"
			});
			that.sendAction("loggedIn");
		}, data => {
			that.setProperties({
				loading: false,
				errors: ["An error occurred."]
			});
		});
	}
});
