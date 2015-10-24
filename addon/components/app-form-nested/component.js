import Ember from 'ember';
import AppForm from "../app-form/component";
import layout from "../app-form/template";

export default AppForm.extend({
	layout: layout,
	
	parentModel: null,
 	parentField: null,

 	modelParentField: null,

  persist() {
    var model = this.get("model");

    // Set the parent.
    var parent = this.get("parentModel");
    if (this.get("modelParentField")) {
      model.set(this.get("modelParentField"), parent);
    }

    // Add new model to parent.
    parent.get(this.get("parentField")).addObject(model);

    this._super(...arguments);

  },
});
