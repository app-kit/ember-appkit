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
  canOrderHierarchy: false,
  autoPersistOrder: true,
	orderField: "weight",
	orderHierarchyParentField: "parent",
	orderHierarchyChildrenField: "children",
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

		// Action can be: up|down|up-parent|down-child
		order(action, index, model) {
			let field = this.get("orderField");
			let models = this.get("models");

			// The models affected by the reordering.
			// Needed for persisting if autoPersistOrder is true.
			let updatedModels = [model];

			if (action == "up") {
				let previous = models.objectAt(index-1);
				let previousWeight = previous.get(field);

				previous.set(field, model.get(field));
				model.set(field, previousWeight);

				updatedModels.push(previous);
			} else if (action == "down") {
				let next = this.get("models").objectAt(index+1);
				let nextWeight = next.get(field);

				next.set(field, model.get(field));
				model.set(field, nextWeight);

				updatedModels.push(next);
			} else if (action === "left") {
				let parentField = this.get("orderHierarchyParentField");
				let childrenField = this.get("orderHierarchyChildrenField");

				let parent = model.get(parentField);
				let parentsParent = parent.get(parentField);

				let weight = 0;

				if (parentsParent) {
					weight = parentsParent.get(childrenField).get("length");
				} else {
					weight = this.get("models").get("length");
				}

				model.setProperties({
					parent: parentsParent,
					weight: weight
				});

				parent.get(childrenField).removeObject(model);

				updatedModels.push(model);
				updatedModels.push(parent);
			} else if (action === "right") {
				let parentField = this.get("orderHierarchyParentField");
				let childrenField = this.get("orderHierarchyChildrenField");
				
				let newParent = this.get("models").objectAt(index - 1);
				let newParentChildren = newParent.get(childrenField);
				newParentChildren.addObject(model);

				model.set(parentField, newParent);
				model.set("weight", newParentChildren.get("length") - 1);

				updatedModels.push(model);
				updatedModels.push(newParent);
			}

			if (this.get("autoPersistOrder")) {
				this.set("updatingOrder", true);

				let promises = [];
				for (let i = 0; i < updatedModels.length; i++) {
					promises.push(updatedModels[i].save());
				}

				Ember.RSVP.all(promises).then(() => {
					this.setProperties({
						updatingOrder: false,
						updateCounter: this.get("updateCounter") + 1
					});
				}, data => {
					bootbox.alert("Error while updating order.");
					console.log("Update ordering error: ", data);
				});
			} else {
				this.update();
			}
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
				this.set("loading", false);
			})
		},

		formSubmitted(created) {
			this.set("updateCounter", this.get("updateCounter") + 1);
			this.set("formModel", null);
		},

		formCancelled() {
			this.set("formModel", null);
		},

		delete(model, noConfirm) {
			bootbox.confirm("Are you sure?", flag => {
				if (flag) {
					this.delete(model);
				} else {
					// No-op.
				}
			});
		}
	},

	delete(model) {
		model.deleteRecord();
		model.save().then(() => {

		}, data => {
			bootbox.alert("An error occurred while deleting.");
		})
	}
});
