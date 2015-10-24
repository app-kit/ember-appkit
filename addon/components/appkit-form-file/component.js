import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  bucket: null,

  parentModel: null,
  field: null,

  file: null,

  uploadingFileName: null,
  uploadProgress: 0,


  appkit: Ember.inject.service("appkit"),
  uploadUrl: null,

  formWrapStyle: Ember.computed("file", "uploadingFileName", function() {
  	return this.get("file") || this.get("uploadingFileName") ? "diplay: none;" : "display: block;";
  }),

  progressStyle: Ember.computed("uploadProgress", function() {
  	return "width: " + this.get("uploadProgress") + "%;";
  }),

  actions: {
  	delete() {
  		let f = this.get("file");
  		f.deleteRecord();
  		f.save().then(() => {
  			this.set("file", null);
  		}, data => {
  			bootbox.alert("Could not delete file.");
  		});
  	}
  },
	
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
				component.setProperties({
					uploadingFileName: data.files[0].name,
					uploadProgress: 0
				});

				data.submit();
			},

			progress(e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        component.set("uploadProgress", progress);
      },

      done(e, data) {
      	var file = component.store.createRecord("file", {
      		tmpPath: data.result.data.data[0],
      		fullName: data.files[0].name,
      		bucket: component.get("bucket"),
      	});

      	//models.addObject(file);
      	component.get("parentModel").set(component.get("field"), file);
      	component.setProperties({
      		file: file,
      		uploadingFileName: ""
      	});
      }
		});
	},
});
