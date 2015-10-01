import Ember from 'ember';
import layout from "./template";
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';

export default Ember.Component.extend({
  layout: layout,
	
	// Name of the model.
  modelName: "",

  title: "",

  itemsComponent: "app-list-table",

  // Total model count for pager. 
  totalModels: 0,

  // Base query object to use for querying the API.
  // Here you should specify joins or field limitations.
  // This query will be merged with the current query that contains
  //  filters and sorting. 
  baseQuery: {
  },

  // Current query used, with sorting and filtering info.
  query: {},

  updateCounter: 0,

  // Currently viewed page.
  page: 1,
  // Items per page.
  perPage: 20,

  totalPages: 1,

  // Flag for loading state.
  loading: false,

  update() {
    this.set("updateCounter", this.get("updateCounter") + 1);
  },

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


  // If true, a search form will be rendered.
  searchForm: true,

  // Optional component for an action column.
  actionColumnComponent: null,

  buildQuery() {
    let baseQuery = this.get("baseQuery") || {};
    let query = Ember.$.extend(baseQuery, this.get("query") || {});

    return query;
  },

  models: Ember.computed("modelName", "baseQuery", "query", "updateCounter", function() {
  	var modelName = this.get("modelName");
  	if (!modelName) {
  		return null;
  	}

    let query = this.buildQuery();
    // If no ordering was specified, order by id.
    if (!query.order) {
      query.order = "id";
    }


  	var models = PagedRemoteArray.create({
  		store: this.store,
  		modelName: this.get("modelName"),
  		page: this.get("page"),
  		perPage: this.get("perPage"),
  		otherParams: {query: query}
  	});

  	return models;
  }),

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

  actions: {
    sort(field, ascending) {
      let query = this.get("query");
      if (!ascending) {
        field = "-" + field;
      }
      query.order = field;
      this.set("query", query);

      this.set("query", query);
      this.update();
    }
  }
});
