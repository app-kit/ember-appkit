import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,

  // Bubble up actions.
	target: Ember.computed.alias("targetObject"),

  // Column definition. See app-list for format.
  columns: null,

  // Iterable object with the models.
  models: null,

  // Component for model actions.
  actionColumnComponent: "",

  // See app-list.
  updateModelIsLoading: false,

  // See app-list.
  allowUpdate: false,

  // See app-list.
  allowDelete: false,

  // See app-list.
  totalModels: 0,

  // See app-list.
  canOrder: false,

  // See app-list.
  updatingOrdering: false,

});
