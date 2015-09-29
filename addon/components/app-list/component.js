import Ember from 'ember';
import layout from "./template";
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';

export default Ember.Component.extend({
  layout: layout,
	
	// Name of the model.
  modelName: "",

  title: "",

  // Total model count for pager. 
  totalModels: 0,

  // Filters to apply and sort.
  fixedParams: {},
  params: {},

  // Currently viewed page.
  page: 1,
  // Items per page.
  perPage: 20,

  totalPages: 1,

  // Flag for loading state.
  loading: false,

  models: Ember.computed("modelName", "params", "updateCounter", function() {
  	var modelName = this.get("modelName");
  	if (!modelName) {
  		return null;
  	}

  	var fixedParams = this.get("fixedParams");
  	var params = this.get("params");
  	params = Ember.$.extend(fixedParams, params);

  	var models = PagedRemoteArray.create({
  		store: this.store,
  		modelName: this.get("modelName"),
  		page: this.get("page"),
  		perPage: this.get("perPage"),
  		otherParams: params
  	});

  	return models;
  }),



	// Array of table columns to show.
	// Format: [{
	//   field: "fieldname",
	//   title: "Pretty Field Name",
	//   sort: true,
	//   
	//   // Additional settings for the value component
	//   valueComponentSettings: {}
	//   
	//  // Optional component name for the column value.
	//  // The component will receive "model" and "field" as arguments.
	//   valueComponent: "my-value-component"
	// }]
	columns: null,

	columnList: Ember.computed("modelName", "columns", function() {
		// If custom columns are defined, use them.
		if (this.get("columns")) {
			return this.get("columns");
		}

		// Otherwise, build the columns.
		var modelName = this.get("modelName");
  	if (!modelName) {
  		return null;
  	}

		var columns = [];

		var model = this.store.modelFor(modelName);

		model.eachAttribute(function(name, meta) {
			columns.push({
				field: name,
				title: Ember.String.capitalize(name),
				sort: true
			});
		});

		return columns;
	}),

	// If true, a search form will be rendered.
	searchForm: true,

	// Optional component for an action column.
	actionColumnComponent: null,

	// The get parameter to use for searching.
	searchQueryParam: "search",
});
