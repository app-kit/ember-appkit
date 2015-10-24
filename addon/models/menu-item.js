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

	weight: DS.attr("number"),

	menu: DS.belongsTo("menu"),
	parent: DS.belongsTo("menu-item", {inverse: "children", async: true}),
	children: DS.hasMany("menu-item", {inverse: "parent", async: true}),

	hasParent: Ember.computed("parent", function() {
		return !!this.get("parent");
	}),

	level: Ember.computed("parent", function() {
		let lvl = 0;
		let parent = this.get("parent");
		while (parent) {
			++lvl;
			parent = parent.get("parent");
		}

		return lvl;
	})
});
