import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,
	
	model: null,
	field: "tags",
	tagGroup: null,

	tags: "",

	build: Ember.on("init", function() {
		

	}),
	

	didInsertElement() {
		if (!this.get("model")) {
			throw new Error("No model set");
		}
		if (!this.get("tagGroup")) {
			throw new Error("No tagGroup set");
		}

		var tagGroup = this.get("tagGroup");

		var modelTags = this.get("model").get(this.get("field"));

		// Build list of tag names.
		var tagNames = [];
		modelTags.forEach(function(item) {
			tagNames.push(item.get("tag"));
		});

		// Set the initial value for the tag input.
		var input = Ember.$(this.get("element")).find("input");
		input.val(tagNames.join(","));

		// Initialize tag input.
		input.tagsinput();

		// On change, update.

		input.on("itemAdded", event => {
			var tagName = event.item;

			// Try to find existant tag.
			var matchedTag = this.store.peekAll("tag").filterBy("group", tagGroup).filterBy("tag", tagName);
			if (matchedTag.length > 0) {
				modelTags.addObject(matchedTag);
			} else {
				var newTag = this.store.createRecord("tag", {
					tag: tagName,
					group: tagGroup
				});
				modelTags.addObject(newTag);
			}
		});

		input.on("itemRemoved", event => {
			var tagName = event.item;

			var tag = modelTags.filterBy("tag", tagName).get("content")[0];
			modelTags.removeObject(tag);
		});

	}
});
