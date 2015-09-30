import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,

	// Bubble up actions.
	target: Ember.computed.alias("targetObject"),
	
	// The model. Must be passed in.
	model: null,

	// THe model field name.
	// May be empty if you are rendering a custom column.
	field: null,

	// The title to show.
	title: null,

	// Set to true to enable sorting.
	sort: false,

	// Render the column. 
	// Overwrite this to change the column contents.
	renderColumn: function(model, field) {
		return model.get(field);
	},

	value: Ember.computed("model", "field", "renderColumn", function() {
		return this.renderColumn(this.get("model"), this.get("field"));
	})
});
