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
	mediaType: DS.attr("string"),

	isImage: DS.attr("boolean"),
	width: DS.attr("number"),
	height: DS.attr("number"),

	weight: DS.attr("number"),
	Data: DS.attr(),
	type: DS.attr("string"),

	tmpPath: DS.attr("string"),

	parentFile: DS.belongsTo("file", {async: false, inverse: "relatedFiles"}),
	relatedFiles: DS.hasMany("file", {async: false, inverse: "parentFile"}),

	url: Ember.computed("id", "fullName", function() {
		let id = this.get("id");
		if (!id) {
			return null;
		}

		let host = this.container.lookupFactory("config:environment").appkit.apiHost;
		let url = "http://" + host + "/files/" + id + "/" + this.get("fullName");

		return url;
	}),

	imageUrl(width, height, filters) {
		let id = this.get("id");
		if (!id) {
			return null;
		}

		let host = this.container.lookupFactory("config:environment").appkit.apiHost;
		let url = "http://" + host + "/images/" + id + "/" + this.get("fullName");

		url += `?width=${width}&height=${height}`;

		if (filters) {
			url += "&filters=" + filters.join(",");
		}

		return url;
	}
});
