import Ember from 'ember';
import layout from "./template";

export default Ember.Component.extend({
	layout: layout,
	
	// Bubble up actions.
	target: Ember.computed.alias("targetObject"),

  model: null,

	allowUpdate: true,
	allowDelete: true,

	// Format: 
	// [{
	//  action: "actionName",
	//  label: "",
	//  icon: "",
	//  btnClass: "" 
	// }]
	
	extraActions: [],
});
