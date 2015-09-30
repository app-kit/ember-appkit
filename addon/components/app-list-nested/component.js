import Ember from 'ember';
import AppListEditable from "../app-list-editable/component";
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';
import layout from "./template";

export default AppListEditable.extend({
	layout: layout,
  
  parentModel: null,
	parentField: null,
	modelParentField: null,

	createFormComponent: "app-form-nested",
	updateFormComponent: "app-form-nested",

  models: Ember.computed("modelName", "query", "baseQuery", "updateCounter", "parent", "parentField", function() {
    var modelName = this.get("modelName");
    var parent = this.get("parentModel");
    var modelParentField = this.get("modelParentField");

    if (!(modelName && parent && modelParentField)) {
      return null;
    }

    let query = this.buildQuery();

    query.filters = query.filters || {};
    query.filters[this.get("modelParentField") + "ID"] = parent.get("id");

    var models = PagedRemoteArray.create({
      store: this.store,
      modelName: modelName,
      page: this.get("page"),
      perPage: this.get("perPage"),
      otherParams: {query: query}
    });

    return models;
  }),

});
