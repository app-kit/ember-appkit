import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr("string"),

	validations: {
		role: {
			presence: true,
			length: {minimum: 4}
		}
	}
});
