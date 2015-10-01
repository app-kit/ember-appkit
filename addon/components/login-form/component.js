import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,

  user: "",
	password: "",

	actions: {
		login: function() {
			var user = this.get("user");
			var pw = this.get("password");

			if (user == "") {
				this.set("error", "You must  specify your email or username.")
				return
			}

			if (pw == "") {
				this.set("error", "You must specify your password.")
				return
			}

			this.setProperties({
				"error": null,
				"loading": true
			});

			var data = {
				user: user,
				adaptor: "password",
				"auth-data": {
					password: pw
				}
			};

			var that = this;

			this.get('session').authenticate('authenticator:appkit', data).then(function() {
				that.sendAction("loggedIn");
				that.setProperties({
					loading: false
				});
			}, function(data) {
				that.setProperties({
					loading: false,
					error: data
				});
			});	
		}
	}
});
