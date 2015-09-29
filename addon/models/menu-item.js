import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr("string"),
	description: DS.attr("string"),
	enabled: DS.attr("boolean"),
	isPlaceholder: DS.attr("boolean"),
	title: DS.attr("string"),
	url: DS.attr("string"),
	route: DS.attr("string"),
	routeArgs: DS.attr("string"),

	menu: DS.belongsTo("menu"),
	parent: DS.belongsTo("menu-item", {inverse: "children"}),
	children: DS.hasMany("menu-item", {inverse: "parent"})
});
