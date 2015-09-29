import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,
	
	model: null,
	field: null,
	label: "",
	nameField: "",

	relatedModels: null,
	relatedModelType: null,
	many: false,

	options: [],
	selectedOption: null,

	loading: true,
	error: "",

	fetchData: Ember.on("init", function() {
		var model = this.get("model");
		var field = this.get("field");
		
		var info = null;

		model.eachRelationship(function(name, meta) {
			if (name === field) {
				info = meta;
				return false;
			}
		});

		if (info === null) {
			throw new Error("Relationship field " + field + " does not exist on model " + model.get("modelName"));
		}

		var targetModel = info.type;
		var many = info.kind === "hasMany";

		var nameField = this.get("nameField");
		if (!nameField) {
			console.log("Warning: no nameField specified for app-form-relationshiop");
			nameField = "id";
		}
		// First, find the related models.

		this.set("loading", true);
		var that = this;

		let relatedItems = model.get(field);

		// Now, query the store for all related items.
		that.store.findAll(targetModel).then(function(items) {
			var options = [];
			var selectedOption = null;

			if (!many) {
				selectedOption = items.get("id");
			}

			// Build options.
			items.forEach(function(item) {
				options.push({
					key: item.get("id"),
					label: item.get(nameField),
					enabled: relatedItems.contains(item)
				});
			});

			that.setProperties({
				loading: false,
				relatedModelType: targetModel,
				many: many,
				relatedModels: relatedItems,
				options: options,
				selectedOption: selectedOption
			});

		}, function(errData) {
			that.setProperties({
				loading: false,
				error: "Could not load related models."
			});
		});

		return info;
	}),

	actions: {

		// Action for a changed selection if not many.
		// Triggerd by x-select.
		selectionChanged(id) {
			var model = this.get("model");
			var item = this.store.peekRecord(this.get("relatedModelType", id));
			model.set(this.get("field"), item);
			model.set("isDirty", true);
		},

		// Checkbox action for many select.
		itemSelected(id) {
			var model = this.get("model");
			var item = this.store.peekRecord(this.get("relatedModelType"), id);

			model.get(this.get("field")).then(related => {
				if (related.contains(item)) {
					related.removeObject(item);	
				} else {
					related.addObject(item);
				}
				model.set("isDirty", true);
			});
		}
	}
});
