
export function initialize(container, application) {
	// Inject appkit service into routes, controllers and components.
	application.inject('component', 'appkit', 'service:appkit');
	application.inject('route', 'appkit', 'service:appkit');
	application.inject('controller', 'appkit', 'service:appkit');

	// Inject session into components and controlelrs, 
	// since ember-simple-auth does not do it.
	application.inject("component", "session", "session:main");
	application.inject("controller", "session", "session:main");
	application.inject("route", "session", "session:main");

	// Also inject the store.
	application.inject("component", "store", "service:store");
	application.inject("controller", "store", "service:store");
	application.inject("route", "store", "service:store");
}

export default {
  name: 'appkit',
  initialize: initialize
};
