import Ember from 'ember';
import AppListEditable from "../app-list-editable/component";
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import layout from "./template";

export default AppListEditable.extend({
	layout: layout,
  
  parentModel: null,
	parentField: null,
	modelParentField: null,

  autoPersistOrder: false,

	createFormComponent: "app-form-nested",
	updateFormComponent: "app-form-nested",

  models: Ember.computed("parentModel", "parentField", "updateCounter", function() {
    var parent = this.get("parentModel");
    var parentField = this.get("parentField");

    if (!(parent && parentField)) {
      return null;
    }

    let models = parent.get(parentField);
    if (this.get("canOrder")) {
      models = models.sortBy(this.get("orderField"));
    }

    return models;
  }),

  totalModels: Ember.computed("models", function() {
    return this.get("models").get("length");
  }),

  actions: {

  }

});
