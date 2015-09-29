import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,
	
	model: null,
	// Field name.
	field: null,
	label: null,

	didInsertElement() {
		var content = this.get("model").get(this.get("field"));

		var element = Ember.$(this.get("element"));
		var editorId = element.attr("id") + "-editor";
		element.find(".editor-wrap").attr("id", editorId);
		
		var editor = CKEDITOR.appendTo(editorId, null, content);
		var updating = false;

		editor.on("change", () => {
			if (!updating) {
				updating = true;
				this.get("model").set(this.get("field"), editor.getData());
				updating = false;
			}
		});
	}
});
