import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  // Bubble up actions.
  target: Ember.computed.alias("targetObject"),

  model: null,
  index: 0,
  updatingOrdering: false,
  totalModels: 0,

  isLast: Ember.computed("index", "totalModels", function() {
  	return this.get("index") === this.get("totalModels") - 1;
  })
});
