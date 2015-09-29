/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-appkit',

  afterInstall: function() {
  	this._super(arguments);

    this.addBowerPackageToProject('bootbox.js'); 
    this.addBowerPackageToProject('bootstrap-tagsinput'); 
    return this.addBowerPackageToProject("blueimp-file-upload");
  },

  included: function(app) {
  	this._super.included(app);

  	// Bootbox.js. 
	  app.import(app.bowerDirectory + "/bootbox.js/bootbox.js");

	  // Jquery file upload.
	  app.import(app.bowerDirectory + "/blueimp-file-upload/js/vendor/jquery.ui.widget.js");
	  app.import(app.bowerDirectory + "/blueimp-file-upload/js/cors/jquery.xdr-transport.js");
	  app.import(app.bowerDirectory + "/blueimp-file-upload/js/jquery.fileupload.js");

	  // Bootstrap-tagsinput.
	  app.import(app.bowerDirectory + "/bootstrap-tagsinput/dist/bootstrap-tagsinput.js");
	  app.import(app.bowerDirectory + "/bootstrap-tagsinput/dist/bootstrap-tagsinput.css");	
  }
};