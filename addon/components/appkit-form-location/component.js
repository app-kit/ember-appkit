import Ember from 'ember';
import layout from './template';
import BasicNestedForm from "ember-cli-appkit/components/app-form-nested-basic/component"; 

export default BasicNestedForm.extend({
  layout: layout,

  geocoder: Ember.inject.service("geocoder"),

  autocomplete: true,
  autocompletePlaceholder: "Search for your address...",

  loading: false,

  showForm: false, 

  model: null,

  target: this,

  countrySelect: true,
  countryOptions: [
    {id: "at", label: "Österreich"},
    {id: "de", label: "Deutschland"}
  ],

  stateSelect: false,
  stateOptions: [],

  postalCodeSelect: false,
  postalCodeOptions: [],



  actions: {
    showForm() {
      this.set("showForm", true);
    }
  },

  initialize: Ember.on("init", function() {
    let parent = this.get("parentModel");
    let location = parent.get(this.get("parentModelField"));
    if (!location) {  
      location = this.store.createRecord("location");
      parent.set(this.get("parentModelField"), location);
    } else {
      this.set("showForm", true);
    }

    this.set("model", location);
  }),

  didInsertElement() {
  	if (this.get("autocomplete")) {
  		//this.set("loading", true);

  		let element = Ember.$(this.get("element")).find("input")[0];

  		this.get("geocoder").initAutocomplete(element, place => {
  			this.updatePlace(place);
  		}).then(() => {
  			this.set("loading", false);
  		}, err => {
  			this.setProperties({
  				autocomplete: false,
  				loading: false,
  			});
  		});
  	}
  },

  updatePlace(data, info) {
    let model = this.get("model");

    for (var key in data) {
      model.set(key, data[key]);   
    }
    this.set("showForm", true);
    console.log(data, model);
  }
});
