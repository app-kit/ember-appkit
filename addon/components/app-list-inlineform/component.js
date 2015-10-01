import Ember from 'ember';
import NestedAppList from "../app-list-nested/component";
import layout from './template';


export default NestedAppList.extend({
  layout: layout,

  actions: {
  	update() {
  		// No-op.
  		return;
  	}
  }
});
