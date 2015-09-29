import Ember from 'ember';
import AppList from "../app-list/component";
import layout from './template';

export default AppList.extend({
  layout: layout,

  modelTitleField: "",
  modelTitle: "",

 	buildModelTitle: Ember.on("init", function() {
 		var title = this.get("modelTitle");
 		if (!title) {
 			title = Ember.String.capitalize(this.get("modelName"));
 			this.set("modelTitle", title);
 		}
 	}),

 	tableWrapClass: Ember.computed("formModel", function() {
  	return this.get("formModel") ? "hidden" : "";
  }),

  actionColumnComponent: "app-list-action-column",

  updateCounter: 0,

 	// Params that will be added to the api request for fetching the full model for updating.
  updateQueryParams: {},

  	// Enable create/edit/delete links.
	allowCreate: true,
	allowUpdate: true,
	allowDelete: true,

	// If true, the create and update forms will be shown on the same route,
	// not on a different one.
	inlineForm: true,

	// The form component to use.
	createFormComponent: "app-form",
	updateFormComponent: "app-form",

	// Form component for currently edited model.
	formComponent: null,
	// Currently edited model.
	formModel: null,
	formIsCreate: false,

	updateModelIsLoading: false,

	// Title for current form.
	formTitle: "",

	actions: {
		create() {
			this.setProperties({
				formComponent: this.get("createFormComponent"),
				formTitle: "New " + this.get("modelTitle"),
				formModel:  this.store.createRecord(this.get("modelName"), {}),
				formIsCreate: true
			});
		},

		update(model) {
			// Load full model for updating.
			var modelName = this.get("modelName");
			var params = this.get("updateQueryParams") || {};

			params.filters = "id:" + model.get("id");

			this.set("updateModelIsLoading", true);
			this.store.queryRecord(modelName, params).then(result => {
				var model = result.get("firstObject");


				if (!model) {
					this.set("updateModelIsLoading", false);
					bootbox.alert("Could not find model, api returned no result");
					return;
				}

				// Model was loaded. SHow the update form.
				var name = this.get("modelTitle");

				var titleField = this.get("modelTitleField");
				if (titleField !== "") {
					var title = model.get(titleField);
					if (title) {
						name += ": " + title;
					}
				}

				this.setProperties({
					formComponent: this.get("updateFormComponent"),
					formTitle: "Update " + name,
					formModel:  model,
					formIsCreate: false,
					updateModelIsLoading: false
				});
			}, errdata => {
				// Request failed.
				// Show error.
				let msg = "Unknown error";

				let errors = errdata.errors;
				if (errors) {
					msg = errors[0].message || errors[0].code;
				}

				bootbox.alert("Could not load model for updating: " + msg);	
			})
		},

		formSubmitted(created) {
			this.set("updateCounter", this.get("updateCounter") + 1);
			this.set("formModel", null);
		},

		formCancelled() {
			this.set("formModel", null);
		},

		delete(model) {
			bootbox.confirm("Are you sure?", flag => {
				if (flag) {
					model.deleteRecord();
					model.save();

					// Trigger a reload.
					//this.set("updateCounter", this.get("updateCounter") + 1);
				}
			});
		}
	}
});
