import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,
	
	model: null,
	field: null,

	settings: {
		relatedField: null
	},
	
	// Computed value.	
	computedValue: "",

	fetchData: Ember.computed("model", "field", "settings", function() {
		var settings = this.get("settings") || {};
		var relatedField = settings.relatedField;
		if (!relatedField) {
			relatedField = "id";
			console.log("Warning: no relatedField set for field " + this.get("field"));
		}

		this.get("model").get(this.get("field")).then(related => {
			var values = [];

			related.forEach(function(item) {
				values.push(item.get(relatedField));
			});

			this.set("computedValue", values.join(", "));
		});
	}),
});
