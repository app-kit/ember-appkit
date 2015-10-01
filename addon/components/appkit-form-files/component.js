import Ember from 'ember';
import NestedList from "../app-list-nested/component";
import layout from "./template";

var UploadingFile = Ember.Object.extend({
	progress: 0,
	data: null,
	name: null,
});

export default NestedList.extend({
	layout: layout,

	appkit: Ember.inject.service("appkit"),
	
	bucket: null,

	uploadingFiles: Ember.A([]),

	didInsertElement() {
		this._super.apply(arguments);

		if (!this.get("bucket")) {
			throw new Error("Must specify bucket.");
		}

		var url = this.appkit.get("apiUrl")
		url += "/file-upload";
		this.set("uploadUrl", url);

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
      	let models = component.get("models");

      	var file = component.store.createRecord("file", {
      		tmpPath: data.result.data.data[0],
      		fullName: data.files[0].name,
      		bucket: component.get("bucket"),
      		weight: models.get("length")
      	});

      	//models.addObject(file);
      	component.get("parentModel").get(component.get("parentField")).addObject(file);
      	this.set("updateCounter", this.get("updateCounter") + 1);
      }
		});
	},
});
