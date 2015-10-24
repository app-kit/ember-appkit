import Ember from 'ember';
import NestedAppList from "../app-list-nested/component";
import layout from './template';


export default NestedAppList.extend({
  layout: layout,

  createLabel: "",

  actions: {
  	update() {
  		// No-op.
  		return;
  	},

  	create(model) {
  		if (!model) {
  			model = this.store.createRecord(this.get("modelName"));
  		}

  		let modelField = this.get("modelParentField");
  		let parent = this.get("parentModel");
  		let parentField = this.get("parentField");

  		if (modelField) {
  			model.set(modelField, parent);
  		}

  		parent.get(parentField).addObject(model);
  		this.update();
  	}
  }
});
