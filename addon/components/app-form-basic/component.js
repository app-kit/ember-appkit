import Ember from 'ember';
import EmForm from "ember-rapid-forms/components/em-form"
import layout from "./template";

export default EmForm.extend({
  layout: layout,

  // Set em-form values.
  action: "submit",
  
  
  // Bubble up actions.
  target: Ember.computed.alias("targetObject"),

  model: null,
  loading: false,
  errors: null,

  defaults: {},

  // Allows to customize the submit method called on the model.
  submitMethod: "save",

  // Format: [{
  //   component: "",
  //   field: "fieldName",
  //   type: "string", // string|boolean|relationship|... equals the meta.type from model.eachAttribute
  //   placeholder: "placeholder",
  //   label: "label"  
  // }
  // ]
  fields: null,


  errorList: [],

  setDefaults: Ember.on("init", function() {
    var model = this.get("model");
    var defaults = this.get("defaults");
    for (var key in defaults) {
      model.set(key, defaults[key]);
    }
  }),


  isNew: Ember.computed("model", function() {
  	return this.get("model").get("id") == null;
  }), 

  fieldList: Ember.computed("fields", "model", function() {
    var model = this.get("model");

    var attributes = {};
    model.eachAttribute(function(name, meta) {
      attributes[name] = meta;
    });
    model.eachRelationship(function(name, meta) {
      attributes[name] = meta;
    });

    var customFields = this.get("fields");
    if (customFields) {
      // Fill in properties.

      for (var i = 0; i < customFields.length; i++) {
        var field = customFields[i];

        if (!field.field) {
          throw new Error("Custom field specification without .field");
        }

        var meta = attributes[field.field];
        if (!meta) {
          throw new Error("Specified inexistant field " + field.field);
        }

        if (!field.type) {
          field.type = meta.type;
        }
        if (!field.placeholder) {
          field.placeholder = Ember.String.capitalize(field.field);
        }
        if (!field.label) {
          field.label = Ember.String.capitalize(field.field);
        }
      }

      return customFields;
    }

  	var fields = [];

  	model.eachAttribute(function(name, meta) {
  		fields.push({
  			component: "",
  			field: name,
  			type: meta.type,
  			placeholder: Ember.String.capitalize(name),
  			label: Ember.String.capitalize(name)
  		});
  	});

    model.eachRelationship(function(name, meta) {
      fields.push({
        component: "",
        field: name,
        type: "relationship",
        placeholder: Ember.String.capitalize(name),
        label: Ember.String.capitalize(name)
      });
    });

  	return fields;
  }),

  persist() {
    this.set("loading", true);

    let model = this.get("model");

    model[this.get("submitMethod")]().then(() => {
      this.set("loading", false);
      this.sendAction("formSubmitted");
    }, data => {
      let errors = data.errors;
      if (!errors) {
        errors = [{message: "Could not save model. An unknown error occurred"}];
      }

      this.setProperties({
        loading: false,
        errors: errors
      });
      console.log("Error while saving: ", model, data);
    });
  },

  submit(e) {
    if (e) {
      e.preventDefault();
    }

    this.triggerAction("submit");
    return false;
  },

  updateErrorList() {
    let errors = this.get("model.errors");
    let errList = [];
    Object.keys(errors).forEach(function(key) {
      let err = errors.get(key);
      if (err.length > 0) {
        errList.push({key: key, message: err[0]});
      }
    });

    this.set("errorList", errList);
  },

  actions: {
  	submit: function() {
  		var model = this.get("model");

      window.scrollTo(0, 0);

      if (!model.validate) {
        this.persist();
      } else {
        model.validate().then(() => {
          this.persist();
        }, data => {
          this.updateErrorList();
        });
      }
  	},

  }
});
