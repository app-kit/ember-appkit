import AppkitSerializer from "ember-cli-appkit/serializers/appkit";

export function initialize(application) {
	// Inject appkit service into routes, controllers and components.
	application.inject('component', 'appkit', 'service:appkit');
	application.inject('route', 'appkit', 'service:appkit');
	application.inject('controller', 'appkit', 'service:appkit');

	// Also inject the store.
	application.inject("component", "store", "service:store");
	application.inject("controller", "store", "service:store");
	application.inject("route", "store", "service:store");
}

export default {
  name: 'appkit',
  initialize: initialize
};
