

require('./controllers');
require('./directives');
require('./services');
require('./states.js');
require('./models');


var app = angular.module('App', [
  'ui.router',
  'ngMaterial',
  'App.controllers',
  'App.directives',
  'App.services',
  'App.models',
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

.run(function($rootScope, $state, UserState) {
  ////////////////////////
  // Expose ui router $state
  ////////////////////////
  $rootScope.$state = $state;

  ////////////////////////
  // Expose Userstate
  ////////////////////////
  $rootScope.UserState = UserState;


  $rootScope.$on('$stateChangeSuccess', 
  function(event, toState, toParams, fromState, fromParams){ 
    $('body').removeClass(fromState.name);
    $('body').addClass(toState.name);
  });
});

module.exports = app;