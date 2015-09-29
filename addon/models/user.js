import DS from 'ember-data';

export default DS.Model.extend({
	active: DS.attr("boolean"),
	username: DS.attr("string"),
	email: DS.attr("string"),
	emailConfirmed: DS.attr("boolean"),
	lastLogin: DS.attr("date"),
	userData: DS.attr(),
	createdAt: DS.attr("date"),
	updatedAt: DS.attr("date"),
	roles: DS.hasMany("user-role", {async: true})
});
