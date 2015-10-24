import DS from 'ember-data';
import Ember from "ember";

var inflector = Ember.Inflector.inflector;

export default DS.JSONAPISerializer.extend({
	keyForAttribute(attr, method) {
		return attr;
	},

	keyForRelationship(key, type, method) {
		return key;
	},

	modelNameFromPayloadKey(key) {
		let str = (key || "").replace("_", "-");
		return inflector.singularize(str);
	},

	payloadKeyFromModelName(name) {
		return inflector.pluralize(name);
	},

});
