import DS from 'ember-data';
import Ember from "ember";

function pluralize(key) {
    var str = Ember.String.underscore(key);

    if (str[str.length - 1] === "y") {
        str = str.substring(0, str.length - 2) + "ie";
    }

    if (str[str.length - 1] !== "s") {
        str += "s";
    }

    return str;
}

export default DS.JSONAPIAdapter.extend({
  host: null,
  namespace: null,

  appkit: Ember.inject.service("appkit"),

  buildHost: Ember.on("init", function() {
  	var appkit = this.get("appkit");

  	this.setProperties({
  		host: appkit.get("host"),
  		namespace: appkit.get("apiPrefix")
  	});
  }),

  pathForType: function(type) {
    return pluralize(type);
  },

  buildURL: function(modelName, id, snapshot, requestType, query) {
    query = query || {};
    query.admin = "true";
    return this._super(modelName, id,  snapshot,  requestType, query);
  },

  ajaxOptions() {
    let options = this._super(...arguments);

    let session = this.container.lookup("session:main");
    if (!(session && session.isAuthenticated)) {
      return options;
    }

    let token = session.get("authenticated").token;

    let { beforeSend } = options;
    options.beforeSend = (xhr) => {
      xhr.setRequestHeader("Authentication", token);
      if (beforeSend) {
        beforeSend(xhr);
      }
    };
    return options;
  },

});
