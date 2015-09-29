import Ember from "ember";
import DS from 'ember-data';

export default DS.Model.extend({
	userID: DS.attr(),
	createdAt: DS.attr("date"),
	updatedAt: DS.attr("date"),
	published: DS.attr("boolean"),
	name: DS.attr("string"),
	type: DS.attr("string"),
	language: DS.attr("string"),
	title: DS.attr("string"),
	slug: DS.attr("string"),
	summary: DS.attr("string"),
	content: DS.attr("string"),

	tags: DS.hasMany("tag", {async: false}),
	//comments: DS.hasMany("comment", {async: true}),

	files: DS.hasMany("file", {async: false}),
	attachedFiles: DS.hasMany("file", {async:false}),

	saveWithRelations() {
		var page = this;

		return page.get("files").save().then(() => {
			return page.get("attachedFiles").save();
		}).then(function() {
			return page.get("tags").save();
		}).then(function() {
			return page.save();
		});
	}
});
