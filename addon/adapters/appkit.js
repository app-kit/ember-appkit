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

    // If "query" is set in query, turn it to json.
    if (typeof query === "object" && query.query && typeof query.query === "object") {
      query.query = JSON.stringify(query.query);
    }
    
    let url = this._super(modelName, id,  snapshot,  requestType, query);
    return url;
  },

  ajaxOptions(url, type, options) {
    // Call super to build up ajax options.
    let ajaxOptions = this._super(url, type, options);

    // If the session is authenticated, add an Authentication header.
    let session = this.container.lookup("session:main");
    if (session && session.isAuthenticated) {
      let token = session.get("authenticated").token;
      ajaxOptions.headers = ajaxOptions.headers || {};
      ajaxOptions.headers.Authentication = token;
    }

    return ajaxOptions;
  },

});
