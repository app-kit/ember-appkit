import Ember from 'ember';
import layout from "./template";

var UploadingFile = Ember.Object.extend({
	progress: 0,
	data: null,
	name: null,
});

export default Ember.Component.extend({
	layout: layout,

	appkit: Ember.inject.service("appkit"),
	
	model: null,
	field: null,
	label: null,

	bucket: null,

	files: null,
	uploadingFiles: Ember.A([]),

	url: null,

	didInsertElement() {
		this._super.apply(arguments);

		if (!this.get("bucket")) {
			throw new Error("Must specify bucket.");
		}

		var url = this.appkit.get("apiUrl")
		url += "/file-upload";
		this.set("uploadUrl", url);

		var files = this.get("model").get(this.get("field"));

		if (files.then) {
			files.then(files => {
				this.set("files", files);
			});
		} else {
			this.set("files", files);
		}

		var element = Ember.$(this.get("element"));
		var component = this;
		element.find(".upload-input").fileupload({
			dataType: "json",
			url: url,

			add(e, data) {
				var file = UploadingFile.create({
					progress: 1,
					name: data.files[0].name,
				});
				component.get("uploadingFiles").addObject(file);
				data.context = file;
				data.submit();
			},

			progress(e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        data.context.set("progress", progress);
      },

      done(e, data) {
      	component.get("uploadingFiles").removeObject(data.context);
      	var file = component.store.createRecord("file", {
      		tmpPath: data.result.data.data[0],
      		fullName: data.files[0].name,
      		bucket: component.get("bucket")
      	});
      	component.get("files").addObject(file);
      }
		});
	},

	actions: {
		delete(file) {
			if (!file.get("id")) {
				// Not persisted yet, so just remove the object from the array.
				this.get("files").removeObject(file);
			} else {
				// Persisted, so delete it remotely.

				// First, the file needs to be removed from the m2m collection.
				var model = this.get("model");
				var files = model.get(this.get("field"));
				files.removeObject(file);

				model.save().then(function() {
					file.deleteRecord();
					return file.save();
				}).then(() => {

				}, data => {
					bootbox.alert("Could not delete file: " + data);
					console.log("File delete error: ", data);
				});
			}
		}
	}

});
