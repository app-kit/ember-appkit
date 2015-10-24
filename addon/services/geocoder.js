import Ember from 'ember';

export default Ember.Service.extend({

	isInitialized: false,

	libraryUrl: "https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places&callback=googleInitialize",

	initialize() {
		let config = this.container.lookupFactory("config:environment");
		let {googleApiKey} = config;

		if (!googleApiKey) {
			throw new Error("ENV.googleApiKey is not set");
		}

		let url = this.get("libraryUrl");
		url = url.replace("API_KEY", googleApiKey);

		let service = this;

		return new Ember.RSVP.Promise(function(resolve, reject) {
			window.googleInitialize = function() {
				service.set("isInitialized", true);
				resolve();
			};

			Ember.$.getScript(url).then(() => {
			}, data => {
				throw new Error("Could not load google api.");
			});
		});

	},

	initAutocomplete(element, callback) {
		if (!this.get("isInitialized")) {
			// Maps api not loaded. Do so now.
			return this.initialize().then(() => {
				this._initAutocomplete(element, callback);
			});
		} else {
			this._initAutocomplete(element,  callback);
			return  new  Ember.RSVP.Promise(function(resolve) {
				resolve();
			});
		}
	},

	_initAutocomplete(element, callback) {
		let $element = Ember.$(element);
		
		if ($element.hasClass("geocoder-initialized")) {
			// Already initialized, so skip.
			return;
		}	
		Ember.$(element).addClass("geocoder-initialized");

		let autocomplete = new google.maps.places.Autocomplete(element, {
			types: ['geocode']
		});

		autocomplete.addListener('place_changed', () => {
			let place = autocomplete.getPlace()

			let data = {
				latitude: place.geometry.location.lat(),
				longitude: place.geometry.location.lng(),
				name: place.name,
				formattedAddress: place.formatted_address
			};

			place.address_components.forEach(function(item) {
				let type = item.types[0];

				switch (type) {
					case "country":
						data.country = item.short_name.toLowerCase();
						break;

					case "locality":
						data.locality = item.short_name;
						break;

					case "street_number":
						data.streetNumber = item.short_name;
						break;

					case "postal_code":
						data.postalCode = item.short_name;
						break;

					case "route":
						data.street = item.short_name;
				}
			});

			callback(data,  place);
		});
	}

});
