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

  canOrder: false,
	orderField: "weight",
	updatingOrder: false,

	// If ordering is enabled, force order by orderField.
	buildQuery() {
		let baseQuery = this.get("baseQuery") || {};
    let query = Ember.$.extend(baseQuery, this.get("query") || {});

		if (this.get("canOrder")) {
			query.order = this.get("orderField");
		}

    return query;
  },

 	// Query that will be used to fetch the the full model for editing.
  updateQuery: {},

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

		orderUp(index, model) {
			let field = this.get("orderField");
			let models = this.get("models");
			let previous = models.objectAt(index-1);
			let previousWeight = previous.get(field);

			previous.set(field, model.get(field));
			model.set(field, previousWeight);

			this.set("updatingOrder", true);
			Ember.RSVP.all([
				model.save(),
				previous.save()
			]).then(() => {
				this.setProperties({
					updatingOrder: false,
					updateCounter: this.get("updateCounter") + 1
				});
			}, data => {
				bootbox.alert("Error while updating order.");
				console.log("Update ordering error: ", data);
			});
		},

		orderDown(index, model) {
			let field = this.get("orderField");
			let next = this.get("models").objectAt(index+1);
			let nextWeight = next.get(field);

			next.set(field, model.get(field));
			model.set(field, nextWeight);

			this.set("updatingOrder", true);

			Ember.RSVP.all([
				model.save(),
				next.save()
			]).then(() => {
				this.setProperties({
					updatingOrder: false,
					updateCounter: this.get("updateCounter") + 1
				});
			}, data => {
				bootbox.alert("Error while updating order.");
				console.log("Update ordering error: ", data);
			});
		},

		// If the optional model argument is set, the given model will be used for
		// the form. This  can be used to set default values.
		create(model) {
			if (!model) {
				model = this.store.createRecord(this.get("modelName"), {})
			}

			if (this.get("canOrder")) {
				let weight = this.get("models").get("length");
				model.set(this.get("orderField"), weight);
			}

			this.setProperties({
				formComponent: this.get("createFormComponent"),
				formTitle: "New " + this.get("modelTitle"),
				formModel: model,
				formIsCreate: true
			});
		},

		update(model) {
			// Load full model for updating.
			var modelName = this.get("modelName");

			let query = this.get("updateQuery") || {};
			query.filters = query.filters || {};
			query.filters.id = model.get("id");

			this.set("updateModelIsLoading", true);
			this.store.query(modelName, {query: query}).then(result => {

				let resultCount = result.get("length");
				if (resultCount !== 1) {
					let msg = "Error while loading model for editing: ";
					if (resultCount === 0) {
						msg += "Model not found";
					} else {
						msg += "Query returned more than one record";
					}

					this.set("updateModelIsLoading", false);
					bootbox.alert(msg);
					return;
				}

				var model = result.get("firstObject");

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
