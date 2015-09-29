import Ember from 'ember';
import AppList from "../app-list/component";
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import layout from "./template";

export default AppList.extend({
	layout: layout,
  
  parentModel: null,
	parentField: null,
	modelParentField: null,

	createFormComponent: "app-form-nested",
	updateFormComponent: "app-form-nested",

  models: Ember.computed("modelName", "params", "updateCounter", "parent", "parentField", function() {
    var modelName = this.get("modelName");
    var parent = this.get("parentModel");
    var modelParentField = this.get("modelParentField");

    if (!(modelName && parent && modelParentField)) {
      return null;
    }

    var fixedParams = this.get("fixedParams");
    var params = this.get("params");
    params = Ember.$.extend(fixedParams, params);

    // Add relation filter.
    params.filters = modelParentField + ":" + parent.get("id");

    var models = PagedRemoteArray.create({
      store: this.store,
      modelName: modelName,
      page: this.get("page"),
      perPage: this.get("perPage"),
      otherParams: params
    });

    return models;
  }),

});
