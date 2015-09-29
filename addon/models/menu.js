import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr("string"),
	language: DS.attr("string"),
	title: DS.attr("string"),
	description: DS.attr("string"),

	items: DS.hasMany("menu-item"),

	validations: {
		name: {
			presence: true
		},
		language: {
			presence: true
		},
		title: {
			presence: true
		}
	}
});
