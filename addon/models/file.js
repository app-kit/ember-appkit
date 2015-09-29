import DS from 'ember-data';
import Ember from "ember";

export default DS.Model.extend({
	name: DS.attr("string"),
	extension: DS.attr("string"),
	fullName: DS.attr("string"),
	title: DS.attr("string"),
	description: DS.attr('string'),

	bucket: DS.attr("string"),
	
	size: DS.attr("number"),
	mime: DS.attr("string"),

	isImage: DS.attr("boolean"),
	width: DS.attr("number"),
	height: DS.attr("number"),

	// Temporary file path, used only on client side.
	tmpPath: DS.attr("string"),

	url: Ember.computed("id", "fullName", function() {
		var id = this.get("id");
		if (!id) {
			return null;
		}

		var host = this.container.lookup("service:appkit").get("host");
		var url = host + "/files/" + id + "/" + this.get("fullName");

		return url;
	})
});
