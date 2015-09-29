// app/authenticators/custom.js
import Base from 'ember-simple-auth/authenticators/base';
import Ember from "ember";

export default Base.extend({

  appkit: Ember.inject.service(),
	
  restore: function(data) {
    if (!data.token) {
      return false;
    }

    var apiUrl = this.get("appkit").get("apiUrl");

  	return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: "GET",
        url: apiUrl + "/sessions/" + data.token,
        dataType: "json",
        beforeSend: function(jqXHR) {
          jqXHR.setRequestHeader('Authentication', data.token);
        }
      }).then(function(data) {
        let sessionData = {
          token: data.data.id,
          user: data.meta.user,
          profile: data.meta.profile
        };
        resolve(sessionData);
      }, function(xhr) {
        reject(xhr.responseJSON || xhr.responseText);
      });
  	});
  },

  authenticate: function(options) {
    var apiUrl = this.get("appkit").get("apiUrl");

    if (!options.adaptor) {
      throw new Error("No .adaptor in options");
    } 
    if (!("auth-data" in options)) {
      throw new Error("No auth-data in options");
    }

    var data = {
      data: {type: "session", attributes: {}},
      meta: {
        user: options.user,
        adaptor: options.adaptor,
        "auth-data": options["auth-data"]
      }
    };

    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
			  type: "POST",
			  url: apiUrl + "/sessions",
			  data: JSON.stringify(data),
        contentType: "application/json",
			  dataType: "json"
			}).then(function(data) {
        let sessionData = {
          token: data.data.id,
          user: data.meta.user,
          profile: data.meta.profile
        };
				resolve(sessionData);
			}, function(xhr) {
				reject(xhr.responseJSON || xhr.responseText);
			});
    });
  },

  invalidate: function(data) {
    var apiUrl = this.get("appkit").get("apiUrl");

  	return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
			  type: "DELETE",
			  url: apiUrl + "/sessions/" + data.token,
			  dataType: "json",
        beforeSend: function(jqXHR) {
          jqXHR.setRequestHeader('Authentication', data.token);
        }
			}).then(function() {
				resolve();
			}, function(xhr) {
        resolve(xhr.responseJSON || xhr.responseText);
			});
    });
  }
});
