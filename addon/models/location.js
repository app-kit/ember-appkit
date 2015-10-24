import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr("string"),
	description: DS.attr("string"),
	comments: DS.attr("string"),
	
	country: DS.attr("string"),
	postalCode: DS.attr("string"),
	state: DS.attr("string"),
	locality: DS.attr("string"),
	street: DS.attr("string"),
	streetNumber: DS.attr("string"),
	top: DS.attr("string"),
	
	formattedAddress: DS.attr("string"),	
	
	latitude: DS.attr("number"),
	longitude: DS.attr("number"),
});
