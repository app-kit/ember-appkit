import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
  layout: layout,
	
	model: null,
  field: null,

  value: Ember.computed("model", "field", function() {
  	return this.get("model").get(this.get("field"));
  })
});
