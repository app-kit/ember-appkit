import DS from 'ember-data';
import Ember from "ember";

var inflector = Ember.Inflector.inflector;

export default DS.Adapter.extend({
  appkit: Ember.inject.service("appkit"),

  findRecord(store, type, id, snapshot) {
    let collection = inflector.pluralize(type.modelName).replace("-", "_");
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get("appkit.appkit").findOne(collection, id).then(data => {
        Ember.run(null, resolve, data);
      });
    }, err => {
      Ember.run(null, reject, err);
    });
  },

  createRecord: function(store, type, snapshot) {
    let data = this.serialize(snapshot, { includeId: true });
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get("appkit.appkit").method("create", data, null).then(data => {
        Ember.run(null, resolve, data);
      });
    }, err => {
      Ember.run(null, reject, err);
    });
  },

  updateRecord: function(store, type, snapshot) {
    let data = this.serialize(snapshot, { includeId: true });
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get("appkit.appkit").method("update", data, null).then(data => {
        Ember.run(null, resolve, data);
      });
    }, err => {
      Ember.run(null, reject, err);
    });
  },

  deleteRecord: function(store, type, snapshot) {
    let id = snapshot.id;
    let collection = inflector.pluralize(type.modelName).replace("-", "_");
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get("appkit.appkit").delete({collection: collection, id: id}).then(data => {
        Ember.run(null, resolve, data);
      });
    }, err => {
      Ember.run(null, reject, err);
    });
  },

  findAll: function(store, type, sinceToken) {
    return this.query(store, type, {});
  },

  query: function(store, type, data) {
    let collection = inflector.pluralize(type.modelName).replace("-", "_");
    if (!data.query) {
      throw new Error("Called store.query(), but data contains no 'query'.");
    }

    let query = data.query;
    if (data.page && data.per_page) {
      query.limit = data.per_page;
      query.offset = (data.page - 1) * data.per_page;
    }
    query.collection = collection; 

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get("appkit.appkit").query(null, query).then(data => {
        // Handle empty data.
        if (!data.data) {
          data.data = [];
        }
        // Handle single object.
        if (!Array.isArray(data.data)) {
          data.data = [data.data];
        }
        Ember.run(null, resolve, data);
      });
    }, err => {
      Ember.run(null, reject, err);
    });
  },

});
