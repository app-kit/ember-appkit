import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,
	
	model: null,
	field: "tags",
	tagGroup: null,

	tags: "",

	loading: true,

	inserted: false,

	build: Ember.on("init", function() {
		this.store.query("tag", {
			query: {filters: {'"group"': this.get("tagGroup")}}
		}).then(() => {
			this.set("loading", false);
			if (this.get("inserted")) {
				this.initialize();
			}
		});
	}),

	initialize() {
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
			if (matchedTag.length === 1) {
				modelTags.addObject(matchedTag.objectAt(0));
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
			let matchedTag = this.store.peekAll("tag").filterBy("group", tagGroup).filterBy("tag", tagName).objectAt(0);
			modelTags.removeObject(matchedTag);
		});
		
	},
	

	didInsertElement() {
		this.set("inserted", true);
		if (!this.get("loading")) {
			this.initialize();
		}
	}
});
