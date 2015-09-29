import DS from 'ember-data';

function pluralize(key) {
    var str = Ember.String.underscore(key);

    if (str[str.length - 1] == "y") {
        str = str.substring(0, str.length - 2) + "ie";
    }

    if (str[str.length - 1] != "s") {
        str += "s"
    }

    return str;
}

export default DS.JSONAPISerializer.extend({

	keyForAttribute(attr, method) {
		return attr;
	},

	keyForRelationship(key, type, method) {
		return key;
	},

	modelNameFromPayloadKey(key) {
		var str = key.replace("_", "-");
		if (str.substring(str.length - 3, str.length) === "ies") {
			str = str.substring(0, str.length - 3) + "y";
		}

		if (str[str.length - 1] === "s") {
			str = str.substring(0, str.length - 1);
		}

		return str;
	},

	payloadKeyFromModelName(name) {
		return pluralize(name);
	}

});

