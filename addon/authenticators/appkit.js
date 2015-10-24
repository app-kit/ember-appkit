// app/authenticators/custom.js
import Base from 'ember-simple-auth/authenticators/base';
import Ember from "ember";

export default Base.extend({

  appkit: Ember.inject.service(),
	
  restore: function(data) {
    console.log("Restoring session with data", data);
    if (data && data.token) {
      return this.get("appkit").continueSession(data.token);
    } else {
      return new Ember.RSVP.Promise(function(resolve, reject) { reject(); });
    }
  },

  authenticate: function(options) {
    return this.get("appkit").startSession(options.adaptor, options["auth-data"], options.user);
  },

  invalidate: function(data) {
    return this.get("appkit").endSession(data.token);
  }
});
