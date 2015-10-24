import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  classNames: "appkit-location-map",

  location: null,
  zoom: 14,

  apiKey() {
  	let key = this.container.lookupFactory("config:environment").googleApiKey;
  	if (!key) {
  		throw new Error("config.googleApiKey not set");
  	}

  	return key;
  },

  mapUrl: Ember.computed("location", function() {
  	let location = this.get("location");
  	let apiKey = this.apiKey();
  	let zoom = this.get("zoom");

  	let url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&zoom=${zoom}&q=`;

  	let lat = location.get("latitude"), lon = location.get("longitude");
  	if (lat && lon) {
  		url += encodeURIComponent(`${lat},${lon}`);
  	} else {
  		url += encodeURIComponent(location.get("formattedAddress"));
  	}

  	return url;
  }),

});
