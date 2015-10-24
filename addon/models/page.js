import Ember from "ember";
import DS from 'ember-data';

export default DS.Model.extend({
	userID: DS.attr(),
	createdAt: DS.attr("date"),
	updatedAt: DS.attr("date"),
	published: DS.attr("boolean"),
	publishedAt: DS.attr("date"),
	name: DS.attr("string"),
	type: DS.attr("string"),
	language: DS.attr("string"),
	title: DS.attr("string"),
	slug: DS.attr("string"),
	listSummary: DS.attr("string"),
	summary: DS.attr("string"),
	content: DS.attr("string"),

	tags: DS.hasMany("tag", {async: false}),

	files: DS.hasMany("file", {async: false}),

	saveWithRelations() {
		var page = this;
		return page.get("files").save().then(() => {
			return page.get("tags").save();
		}).then(function() {
			return page.save();
		});
	},

	getListImage() {
		let image = null;

		this.get("files").forEach(function(file) {
			if (file.get("isImage")) {
				if (file.get("type") === "list_image") {
					image = file;
					return false;
				} else {
					if (!image) {
						image = file;
					}
				}
			}
		});

		return image;
	},

	getGalleryImages() {
		return this.get("files").filterBy("type", "gallery");
	}
});
