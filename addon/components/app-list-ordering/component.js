import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  // Bubble up actions.
  target: Ember.computed.alias("targetObject"),

  canOrderHierarchy: false,

  model: null,
  index: 0,
  updatingOrdering: false,
  totalModels: 0,
});
