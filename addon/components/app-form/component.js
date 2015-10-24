import Ember from 'ember';
import BasicForm from "../app-form-basic/component"
import layout from "./template";

export default BasicForm.extend({
  layout: layout,
  
  // Bubble up actions.
  target: Ember.computed.alias("targetObject"),

  title: "",
  submitButton: false,

  submitLabel: "Save",
  cancelLabel: "Cancel",

});
