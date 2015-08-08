// external angular packages
require('angular-ui-router');

require('./controllers');
require('./directives');
require('./services');
require('./states.js');


var app = angular.module('App', [
  'ui.router',
  'App.controllers',
  'App.directives',
  'App.services',
]);

app.config(function($urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
  ////////////////////////
  // Default URL when route not found 
  ////////////////////////
  $urlRouterProvider.otherwise('/');

  ////////////////////////
  // Settings for html5 mode
  ////////////////////////

  if(window.history && window.history.pushState) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }

  ////////////////////////
  // Don't worry about them trailing slashes
  ////////////////////////

  $urlMatcherFactoryProvider.strictMode(false);

})

.run(function($rootScope, $state) {
  ////////////////////////
  // Expose ui router $state
  ////////////////////////
  $rootScope.$state = $state;
});

module.exports = app;